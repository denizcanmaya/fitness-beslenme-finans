function hesaplaBeslenme(event) {
    event.preventDefault();

    // Form verilerini al
    const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        weight: parseFloat(document.getElementById('weight').value),
        height: parseInt(document.getElementById('height').value),
        activity: parseFloat(document.getElementById('activity').value),
        goal: document.getElementById('goal').value
    };

    // Form doğrulama
    if (!validateForm(formData)) {
        return false;
    }

    // Verileri localStorage'a kaydet
    localStorage.setItem('beslenmeFormData', JSON.stringify(formData));

    // Sonuç sayfasına yönlendir
    window.location.href = 'sonuc.html';
}

function validateForm(data) {
    // Yaş kontrolü
    if (data.age < 1 || data.age > 120) {
        showError('age', 'Yaş 1-120 arasında olmalıdır');
        return false;
    }

    // Kilo kontrolü
    if (data.weight < 30 || data.weight > 300) {
        showError('weight', 'Kilo 30-300 kg arasında olmalıdır');
        return false;
    }

    // Boy kontrolü
    if (data.height < 100 || data.height > 250) {
        showError('height', 'Boy 100-250 cm arasında olmalıdır');
        return false;
    }

    // Aktivite seviyesi kontrolü
    if (!data.activity || data.activity < 1.2 || data.activity > 1.9) {
        showError('activity', 'Geçerli bir aktivite seviyesi seçiniz');
        return false;
    }

    // Hedef kontrolü
    if (!data.goal || !['maintain', 'loss', 'gain'].includes(data.goal)) {
        showError('goal', 'Geçerli bir hedef seçiniz');
        return false;
    }

    return true;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    // Önceki hata mesajını kaldır
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Yeni hata mesajını ekle
    field.parentElement.appendChild(errorDiv);

    // Input alanını vurgula
    field.classList.add('error');
    field.focus();

    // 3 saniye sonra hata mesajını kaldır
    setTimeout(() => {
        errorDiv.remove();
        field.classList.remove('error');
    }, 3000);
}

// Form alanları değiştiğinde hata mesajlarını temizle
document.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => {
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        field.classList.remove('error');
    });
}); 