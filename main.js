/**
 * BH Teknik Servis - Main UI Script
 * Shared application helpers and mobile menu management.
 */

const WHATSAPP_PHONE = '905510007069';

/**
 * WhatsApp URL generator
 */
function getWhatsAppUrl(productTitle) {
  const message = productTitle
    ? `Merhaba, ${productTitle} hakkında detaylı bilgi ve teklif almak istiyorum.`
    : 'Merhaba, endüstriyel çamaşırhane ekipmanı ve teknik servis hakkında bilgi almak istiyorum.';
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Mobile Navigation Drawer Toggle
 */
function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
});
