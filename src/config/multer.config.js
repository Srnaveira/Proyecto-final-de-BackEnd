const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Multer para definir el almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.uid; 
    let uploadPath = path.join(__dirname, '../uploads'); 
  
    // Definir la ruta de destino dependiendo del tipo de archivo
    switch (file.fieldname) {
      case 'dniFront':
        uploadPath = path.join(uploadPath, 'documents', userId);
        break;
      case 'dniBack':
        uploadPath = path.join(uploadPath, 'documents', userId);
        break;
      case 'selfie':
        uploadPath = path.join(uploadPath, 'documents', userId);
        break;
      case 'profileImage':
        uploadPath = path.join(uploadPath, 'profiles', userId);
        break;
      case 'productImage':
        uploadPath = path.join(uploadPath, 'products', userId);
        break;
      default:
        uploadPath = path.join(uploadPath, 'others', userId);
    }

    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    
    const fieldName = file.fieldname;
    
    const fileName = `${uniqueSuffix}-${fieldName}-${path.basename(file.originalname)}`;
    
    cb(null, fileName); 
  }
});


const upload = multer({ storage: storage });

module.exports = upload;
