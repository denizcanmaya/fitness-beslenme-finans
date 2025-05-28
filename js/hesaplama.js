// BMR Hesaplama (Mifflin-St Jeor Formülü)
function hesaplaBMR(kilo, boy, yas, cinsiyet) {
    let bmr;
    if (cinsiyet === 'male') {
        bmr = 88.362 + (13.397 * kilo) + (4.799 * boy) - (5.677 * yas);
    } else {
        bmr = 447.593 + (9.247 * kilo) + (3.098 * boy) - (4.330 * yas);
    }
    return Math.round(bmr);
}

// TDEE Hesaplama
function hesaplaTDEE(bmr, aktivite) {
    return Math.round(bmr * parseFloat(aktivite));
}

// Hedef Kalori Hesaplama
function hesaplaHedefKalori(tdee, hedef) {
    let hedefKalori = tdee;
    if (hedef === 'loss') {
        hedefKalori -= 500;
    } else if (hedef === 'gain') {
        hedefKalori += 500;
    }
    return Math.round(hedefKalori);
}

// Makro Besin Hesaplama
function hesaplaMakrolar(hedefKalori, kilo) {
    const protein = Math.round(kilo * 1.6); // Günlük protein ihtiyacı (gr)
    const yag = Math.round((hedefKalori * 0.25) / 9); // Günlük yağ ihtiyacı (gr)
    const karbonhidrat = Math.round((hedefKalori - (protein * 4 + yag * 9)) / 4); // Günlük karbonhidrat ihtiyacı (gr)
    
    return {
        protein,
        yag,
        karbonhidrat
    };
}

// Kafein Hesaplama
function hesaplaKafein(kilo) {
    const minCaffeine = Math.round(kilo * 3);
    const maxCaffeine = Math.round(kilo * 6);
    return `${minCaffeine}-${maxCaffeine}`;
}

// Beslenme Programı Hesaplama
function hesaplaBeslenmeProgrami(formData) {
    const bmr = hesaplaBMR(formData.weight, formData.height, formData.age, formData.gender);
    const tdee = hesaplaTDEE(bmr, formData.activity);
    const hedefKalori = hesaplaHedefKalori(tdee, formData.goal);
    const makrolar = hesaplaMakrolar(hedefKalori, formData.weight);
    
    return {
        hedefKalori,
        makrolar
    };
}

// Beslenme Programı Oluşturma
function olusturBeslenmeProgrami(hedefKalori, makrolar) {
    const ogunler = {
        kahvalti: [
            { isim: "Yumurta", miktar: 100 },
            { isim: "Peynir", miktar: 50 },
            { isim: "Zeytin", miktar: 30 },
            { isim: "Yulaf Ezmesi", miktar: 50 }
        ],
        araOgun1: [
            { isim: "Meyve", miktar: 200 },
            { isim: "Kuruyemiş", miktar: 30 }
        ],
        ogleYemegi: [
            { isim: "Tavuk Göğsü", miktar: 150 },
            { isim: "Pirinç", miktar: 100 },
            { isim: "Sebze Yemeği", miktar: 200 }
        ],
        araOgun2: [
            { isim: "Yoğurt", miktar: 200 },
            { isim: "Meyve", miktar: 100 }
        ],
        aksamYemegi: [
            { isim: "Balık", miktar: 150 },
            { isim: "Salata", miktar: 200 },
            { isim: "Tam Tahıllı Ekmek", miktar: 50 }
        ]
    };

    return ogunler;
}

document.addEventListener('DOMContentLoaded', function() {
    // Beslenme formu için event listener
    const beslenmeForm = document.getElementById('beslenmeForm');
    if (beslenmeForm) {
        beslenmeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini topla
            const formData = {
                name: document.getElementById('name').value,
                age: document.getElementById('age').value,
                weight: document.getElementById('weight').value,
                height: document.getElementById('height').value,
                gender: document.getElementById('gender').value,
                goal: document.getElementById('goal').value,
                activity: document.getElementById('activity').value
            };
            
            // Verileri localStorage'a kaydet
            localStorage.setItem('beslenmeFormData', JSON.stringify(formData));
            
            // Sonuç sayfasına yönlendir
            window.location.href = 'sonuc.html';
        });
    }

    // Antrenman formu için event listener
    const antrenmanForm = document.getElementById('antrenmanForm');
    if (antrenmanForm) {
        antrenmanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini topla
            const formData = {
                gender: document.getElementById('antrenmanGender').value,
                level: document.getElementById('level').value,
                programStyle: document.getElementById('programStyle').value,
                days: document.getElementById('days').value
            };
            
            // Verileri localStorage'a kaydet
            localStorage.setItem('antrenmanFormData', JSON.stringify(formData));
            
            // Antrenman sonuç sayfasına yönlendir
            window.location.href = 'antrenman-sonuc.html';
        });
    }
});

// Antrenman programı oluşturma fonksiyonu
function olusturAntrenmanProgrami(formData) {
    const program = [];
    
    // Program stilini belirle
    if (formData.programStyle === 'fullbody') {
        // Full Body programı
        for (let i = 1; i <= formData.days; i++) {
            program.push({
                isim: `Gün ${i}`,
                egzersizler: [
                    { isim: 'Bench Press', set: 3, tekrar: '8-12' },
                    { isim: 'Squat', set: 3, tekrar: '8-12' },
                    { isim: 'Deadlift', set: 3, tekrar: '8-12' },
                    { isim: 'Pull-up', set: 3, tekrar: '8-12' },
                    { isim: 'Overhead Press', set: 3, tekrar: '8-12' }
                ]
            });
        }
    } else {
        // PPL programı
        const push = {
            isim: 'Push Günü',
            egzersizler: [
                { isim: 'Bench Press', set: 4, tekrar: '8-12' },
                { isim: 'Overhead Press', set: 3, tekrar: '8-12' },
                { isim: 'Incline Dumbbell Press', set: 3, tekrar: '10-12' },
                { isim: 'Lateral Raise', set: 3, tekrar: '12-15' },
                { isim: 'Tricep Pushdown', set: 3, tekrar: '12-15' }
            ]
        };
        
        const pull = {
            isim: 'Pull Günü',
            egzersizler: [
                { isim: 'Deadlift', set: 4, tekrar: '6-8' },
                { isim: 'Pull-up', set: 3, tekrar: '8-12' },
                { isim: 'Bent Over Row', set: 3, tekrar: '10-12' },
                { isim: 'Face Pull', set: 3, tekrar: '12-15' },
                { isim: 'Bicep Curl', set: 3, tekrar: '12-15' }
            ]
        };
        
        const legs = {
            isim: 'Legs Günü',
            egzersizler: [
                { isim: 'Squat', set: 4, tekrar: '8-12' },
                { isim: 'Romanian Deadlift', set: 3, tekrar: '10-12' },
                { isim: 'Leg Press', set: 3, tekrar: '10-12' },
                { isim: 'Leg Extension', set: 3, tekrar: '12-15' },
                { isim: 'Calf Raise', set: 4, tekrar: '15-20' }
            ]
        };
        
        // Gün sayısına göre programı oluştur
        if (formData.days === '2') {
            program.push(push, legs);
        } else if (formData.days === '3') {
            program.push(push, pull, legs);
        } else if (formData.days === '4') {
            program.push(push, pull, legs, push);
        }
    }
    
    return program;
} 
