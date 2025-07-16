const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('🚀 Iniciando proceso de backup...');

const backupsDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir);
  console.log('📂 Directorio de backups creado.');
}

const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-');
const outputFilePath = path.join(backupsDir, `backup-${timestamp}.zip`);

const output = fs.createWriteStream(outputFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Máxima compresión
});

output.on('close', function() {
  console.log('✅ Backup completado exitosamente.');
  console.log(`📦 Archivo: ${outputFilePath}`);
  console.log(`Total: ${archive.pointer()} bytes`);
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('⚠️ Advertencia durante el backup:', err);
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Leer .gitignore para excluir archivos y carpetas
const gitignorePath = path.join(__dirname, '..', '.gitignore');
const gitignore = fs.existsSync(gitignorePath) 
  ? fs.readFileSync(gitignorePath, 'utf8').split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'))
  : [];

const defaultIgnores = ['node_modules', 'dist', '.vscode', '.idea', 'backups', '.git'];
const ignorePatterns = [...new Set([...defaultIgnores, ...gitignore])];

console.log('🚫 Excluyendo los siguientes patrones:', ignorePatterns);

archive.glob('**/*', {
  cwd: path.join(__dirname, '..'),
  ignore: ignorePatterns,
  dot: true // Incluir dotfiles que no estén en .gitignore
});

archive.finalize();

console.log('⚙️ Comprimiendo archivos... Esto puede tardar unos momentos.'); 