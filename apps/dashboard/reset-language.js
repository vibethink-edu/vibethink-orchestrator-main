// 🔧 SCRIPT PARA RESETEAR IDIOMA A INGLÉS
// Pega esto en la consola del browser (F12 → Console)

// Limpiar localStorage
localStorage.removeItem('i18nextLng');
localStorage.removeItem('locale');
localStorage.removeItem('language');

// Limpiar cookies relacionadas con idioma
document.cookie.split(";").forEach(function (c) {
    if (c.includes('locale') || c.includes('lang') || c.includes('i18n')) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    }
});

// Recargar página
window.location.reload();

console.log('✅ Idioma reseteado a inglés. Recargando...');
