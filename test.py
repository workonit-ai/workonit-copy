import requests
import json
# Set up the server URL and file path
server_url = 'http://localhost:3000'
upload_url = f'{server_url}/api/files/upload'
uploadLogo_url = f'{server_url}/api/files/uploadLogo'
presigned_url_endpoint = f'{server_url}/api/files/generate-presigned-url'
list_files_endpoint = f'{server_url}/api/files/listFiles'
file_path = 'sdg_icons_color_goal_2.png'  # Replace with your file path

# Metadata to send with the file
metadata = {
    "key1": "value1",
    "key2": "value2"
}
head ={"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OTBlMzRkZTc3MjAyNDA2Y2Y4NGU2MCIsImVtYWlsIjoiaWRvMTUyMjJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzMzODg1NzksImV4cCI6MTczMzQ3NDk3OX0.MBh3eaIsRMDzhOtG_GKennKMZjm9YAP2DYmRoT4ZTxc"}
# Upload the file with metadata
def upload_file():
    with open(file_path, 'rb') as file:
        files = {
            'file': (file_path, file),

        }
        print(files)
        response = requests.post(upload_url, files=files, data=metadata, headers=head)
        if response.status_code == 200:
            print('File uploaded successfully:', response.text)
        else:
            print('Error uploading file:', response.status_code, response.text)

# Generate a pre-signed URL for the uploaded file
def generate_presigned_url(filename):
    response = requests.get(f'{presigned_url_endpoint}/{filename}', headers=head)
    print(response)
    if response.status_code == 200:
        url = response.text
        print('Pre-signed URL:', url)
    else:
        print('Error generating pre-signed URL:', response.status_code, response.text)
def list_files():
    response = requests.get(f'{list_files_endpoint}', headers=head)
    print(response)
    if response.status_code == 200:
        print(response.text)
    else:
        print('Error generating pre-signed URL:', response.status_code, response.text)
def upload_logo():
    with open(file_path, 'rb') as file:
        files = {
            'file': (file_path, file),

        }
        print(files)
        response = requests.post(uploadLogo_url, files=files, data=metadata, headers=head)
        if response.status_code == 200:
            print('File uploaded successfully:', response.text)
        else:
            print('Error uploading file:', response.status_code, response.text)
 
if __name__ == "__main__":
    upload_logo()
