const Log = require('../../utilities/Log');

exports.extractDbNameFromUri = (uri) => {
    try {
      const url = new URL(uri);
      
      const pathname = url.pathname;
      
      const dbName = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      
      return dbName || "test";
    } catch (error) {
      Log.error('Error parsing MongoDB URI:'+ error);
      return null;
    }
  };