import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para asegurar que un archivo exista en la ruta especificada
async function ensureFileExists(filePath, defaultContent = "[]") {
    try {
        const fileExists = fs.existsSync(filePath);
        if (!fileExists) {
            await fs.promises.writeFile(filePath, defaultContent);
            console.error(`No se encontró el archivo en la ruta: ${filePath}. Se creó un nuevo archivo con el contenido predeterminado.`);
        }
    } catch (error) {
        console.error(`Error al verificar o crear el archivo en la ruta: ${filePath}.`, error);
        throw new Error(`Error al verificar o crear el archivo en la ruta: ${filePath}.`);
    }
}

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export { __dirname, ensureFileExists, upload };
