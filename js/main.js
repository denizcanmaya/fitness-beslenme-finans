document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('beslenmeForm');
    
    // Form gönderilmeden önce validasyon
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Form verilerini localStorage'a kaydet
            saveFormData();
            // Sonuç sayfasına yönlendir
            window.location.href = 'sonuc.html';
        }
    });

    // Form validasyonu
    function validateForm() {
        const adSoyad = document.getElementById('adSoyad').value;
        const yas = document.getElementById('yas').value;
        const kilo = document.getElementById('kilo').value;
        const boy = document.getElementById('boy').value;
        const cinsiyet = document.querySelector('input[name="cinsiyet"]:checked');
        const aktivite = document.getElementById('aktivite').value;
        const hedef = document.getElementById('hedef').value;

        // Boş alan kontrolü
        if (!adSoyad || !yas || !kilo || !boy || !cinsiyet || !aktivite || !hedef) {
            alert('Lütfen tüm alanları doldurunuz!');
            return false;
        }

        // Yaş kontrolü
        if (yas < 15 || yas > 100) {
            alert('Yaş 15-100 arasında olmalıdır!');
            return false;
        }

        // Kilo kontrolü
        if (kilo < 30 || kilo > 300) {
            alert('Kilo 30-300 kg arasında olmalıdır!');
            return false;
        }

        // Boy kontrolü
        if (boy < 100 || boy > 250) {
            alert('Boy 100-250 cm arasında olmalıdır!');
            return false;
        }

        return true;
    }

    // Form verilerini localStorage'a kaydetme
    function saveFormData() {
        const formData = {
            adSoyad: document.getElementById('adSoyad').value,
            yas: document.getElementById('yas').value,
            kilo: document.getElementById('kilo').value,
            boy: document.getElementById('boy').value,
            cinsiyet: document.querySelector('input[name="cinsiyet"]:checked').value,
            aktivite: document.getElementById('aktivite').value,
            hedef: document.getElementById('hedef').value
        };

        localStorage.setItem('beslenmeFormData', JSON.stringify(formData));
    }

    // Input alanlarına event listener'lar ekle
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });

    // Tekil input validasyonu
    function validateInput(input) {
        const value = input.value;
        let isValid = true;
        let errorMessage = '';

        switch(input.id) {
            case 'yas':
                if (value < 15 || value > 100) {
                    isValid = false;
                    errorMessage = 'Yaş 15-100 arasında olmalıdır!';
                }
                break;
            case 'kilo':
                if (value < 30 || value > 300) {
                    isValid = false;
                    errorMessage = 'Kilo 30-300 kg arasında olmalıdır!';
                }
                break;
            case 'boy':
                if (value < 100 || value > 250) {
                    isValid = false;
                    errorMessage = 'Boy 100-250 cm arasında olmalıdır!';
                }
                break;
        }

        // Hata mesajını göster/gizle
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error';
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }

        if (!isValid) {
            errorElement.textContent = errorMessage;
            input.classList.add('invalid');
        } else {
            errorElement.textContent = '';
            input.classList.remove('invalid');
        }

        return isValid;
    }
}); 