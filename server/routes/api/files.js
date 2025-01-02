const fs = require('fs');
const os = require('os');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
let router = require('express').Router();
const auth = require('../auth');
const userFile = require('../../models/UserFile')
const tempDir = path.join(os.tmpdir(), 'your-app-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, tempDir) // Use the temp directory we created
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });
const Assistant = require('../../assistant/Assistant');

const { uploadUserFileToS3, getUrl, uploadLogo, getFile  } = require('../../middleware/aws_s3');
const parseJson = (req, res, next) => {
    if (req.body && req.body.metadata) {
      try {
        req.body.metadata = JSON.parse(req.body.metadata);
      } catch (e) {
        return res.status(400).send('Invalid JSON metadata');
      }
    }
    next();
  };

router
.post('/upload', auth.appendUser, upload.single('file'), parseJson, async (req, res) => {
    try {
      const file = req.file;
      const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};
  
      if (!file) {
        return res.status(400).send(JSON.stringify(req.body));
        
      }
      console.log("file", file)
      const s3ans = await uploadUserFileToS3(file, req.user.id);
      //const s3load = await getFile(file.originalname, req.user.id)
      const openAI = await Assistant.uploadFile(file.path) 
      const newFile = new userFile({
        userId: req.user.id,
        fileName: file.originalname,
        metadata: metadata,
        openAIData: openAI,
      });
      await newFile.save();
      res.send(`File uploaded successfully`);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file.');
    }
  })
  .get('/generate-presigned-url/:filename', auth.appendUser, async (req, res) => {
    const filename = req.params.filename;
    const userId = req.user.id
    try {
      const url = await getUrl(filename, userId)
      res.send(url)
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).send('Error generating pre-signed URL.');
    }
  })
  .post('/uploadLogo', auth.appendUser, upload.single('file'), parseJson, async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send(JSON.stringify(req.body));
        
      }
      console.log("file", req.file.originalname)
      const result = await uploadLogo(file);
      console.log("file", req.file.originalname)

      res.status(200).send(JSON.stringify({url:result.Location}));

    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('Error uploading file.');
    }
  })
  .get('/listFiles', auth.appendUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const files = (await userFile.find({ userId })).map(((item)=>({id:item.id, name:item.fileName, createdAt: item.createdAt})));
      res.send(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).send('Error fetching files.');
    }
  })
  module.exports = router;
    
