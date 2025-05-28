document.addEventListener('DOMContentLoaded', function() {
    try {
        // Form verilerini localStorage'dan al
        const formData = JSON.parse(localStorage.getItem('beslenmeFormData'));
        if (!formData) {
            throw new Error('Form verileri bulunamadı');
        }

        // Sonuç sayfasının HTML'ini localStorage'a kaydet
        const saveResultPage = () => {
            const resultContent = document.getElementById('resultContent').innerHTML;
            localStorage.setItem('beslenmeSonucHTML', resultContent);
        };

        // Kişisel bilgileri göster
        document.getElementById('kisiAdi').textContent = formData.name || 'İsimsiz';
        document.getElementById('yas').textContent = formData.age || '0';
        document.getElementById('kilo').textContent = formData.weight || '0';
        document.getElementById('boy').textContent = formData.height || '0';
        document.getElementById('cinsiyet').textContent = formData.gender === 'male' ? 'Erkek' : 'Kadın';
        document.getElementById('hedef').textContent = getHedefText(formData.goal);

        // Beslenme değerlerini hesapla
        const bmr = calculateBMR(formData);
        const tdee = calculateTDEE(bmr, formData.activity);
        const targetCalories = calculateTargetCalories(tdee, formData.goal);
        const macros = calculateMacros(targetCalories, formData.weight, formData.goal);

        // Makro değerlerini göster
        document.getElementById('kalori').textContent = `${Math.round(targetCalories)} kcal`;
        document.getElementById('protein').textContent = `${Math.round(macros.protein)} g`;
        document.getElementById('yag').textContent = `${Math.round(macros.fat)} g`;
        document.getElementById('karbonhidrat').textContent = `${Math.round(macros.carbs)} g`;

        // Öğün planını göster
        showMealPlan();

        // Beslenme notlarını göster
        showNutritionNotes(macros.fat, formData.weight);

        // Sayfa yüklendiğinde sonuçları localStorage'a kaydet
        saveResultPage();

    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu: ' + error.message);
        window.location.href = 'index.html';
    }
});

function calculateBMR(data) {
    if (data.gender === 'male') {
        return (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
    } else {
        return (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
    }
}

function calculateTDEE(bmr, activity) {
    return bmr * activity;
}

function calculateTargetCalories(tdee, goal) {
    switch (goal) {
        case 'loss':
            return tdee - 500;
        case 'gain':
            return tdee + 500;
        default:
            return tdee;
    }
}

function calculateMacros(calories, weight, goal) {
    // Protein calculation based on goal
    const protein = goal === 'loss' ? weight * 2 : weight * 1.6;
    
    // Fat calculation (30% of total calories)
    const fat = (calories * 0.25) / 9;
    
    // Carbs calculation (remaining calories)
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = remainingCalories / 4;
    
    return { protein, fat, carbs };
}

function getHedefText(goal) {
    switch (goal) {
        case 'loss':
            return 'Kilo Verme';
        case 'gain':
            return 'Kilo Alma';
        default:
            return 'Kilo Koruma';
    }
}

function showMealPlan() {
    const formData = JSON.parse(localStorage.getItem('beslenmeFormData'));
    const isWeightGain = formData.goal === 'gain';

    const meals = [
        {
            title: '1. ÖĞÜN',
            items: [
                '✓ Yumurta / Peynir / Zeytin',
                '✓ Maydanoz / Dere Otu / Salata / Domates',
                '❑ Yulaf Ezmesi / Badem veya Klasik Süt / Kuruyemiş / Fıstık Ezmesi / Yumurta ile yapılmış pankek.'
            ]
        }
    ];

    // Kilo alma hedefi için ara öğün ekle
    if (isWeightGain) {
        meals.push({
            title: '1. ARA ÖĞÜN',
            items: [
                '✓ Kuruyemiş (Badem, Ceviz, Fındık)',
                '✓ Meyve (Muz, Elma, Armut)',
                '✓ Protein Shake (İsteğe bağlı)'
            ]
        });
    }

    meals.push({
        title: '2. ÖĞÜN',
        items: [
            '✓ Tavuk Göğsü/Hindi Göğsü/Somon/Yağsız Kıyma',
            '✓ Pirinç/Makarna/Patates/Bulgur',
            '✓ Mor Lahana/Ispanak/Turp',
            '✓ Marul/Maydanoz/Dere Otu',
            '✓ Yoğurt/Ayran/Zero Cola (istenildiğinde tüketilebilir)'
        ]
    });

    // Kilo alma hedefi için ara öğün ekle
    if (isWeightGain) {
        meals.push({
            title: '2. ARA ÖĞÜN',
            items: [
                '✓ Kuruyemiş (Badem, Ceviz, Fındık)',
                '✓ Meyve (Muz, Elma, Armut)',
                '✓ Protein Shake (İsteğe bağlı)'
            ]
        });
    }

    meals.push({
        title: '3. ÖĞÜN',
        items: [
            '✓ Tavuk Göğsü/Hindi Göğsü/Somon/Yağsız Kıyma',
            '✓ Pirinç/Makarna/Patates/Bulgur',
            '✓ Mor Lahana/Ispanak/Turp',
            '✓ Marul/Maydanoz/Dere Otu',
            '✓ Yoğurt/Ayran/Zero Cola (istenildiğinde tüketilebilir)'
        ]
    });

    const mealPlanContainer = document.getElementById('ogunPlan');
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'bg-dark-primary/50 rounded-lg p-6 transform transition-transform hover:scale-[1.02]';
        mealCard.innerHTML = `
            <div class="flex items-center gap-3 mb-4">
                <i class="fas fa-utensils text-emerald-500 text-xl"></i>
                <h4 class="text-xl font-semibold">${meal.title}</h4>
            </div>
            <ul class="space-y-3">
                ${meal.items.map(item => `
                    <li class="flex items-start gap-2">
                        <span class="text-emerald-500 mt-1">${item.startsWith('✓') ? '✓' : '❑'}</span>
                        <span class="text-gray-300">${item.substring(2)}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        mealPlanContainer.appendChild(mealCard);
    });
}

function showNutritionNotes(fatAmount, weight) {
    // Beslenme notları
    const nutritionNotes = [
        '❑ NOT: 2. ve 3. öğünlerde yemek yapılırken toplam yağ kullanılabilir!',
        `❑ Gün içerisinde toplamda ${Math.round(fatAmount)}g tereyağı/hindistan cevizi yağı veya zeytinyağı kullanılacak.`,
        '❑ Kuruyemişler tüketilmek istenildiğinde toplam yağ miktarı göz önünde bulundurulmalıdır.'
    ];

    // Genel beslenme önerileri
    const generalRecommendations = [
        '✓ Tüm gıda ölçümleri çiğ hali ile yapılmalı!',
        '✓ Antrenman öncesi öğünü 1.5 saat önce tüketilmelidir!',
        '✓ Tuz tüketimi günlük olarak 6-9 gr olmalıdır!',
        '✓ Sebzelerle yemek yapılabilir ve yeşillikler bir tabak dolusu tüketilebilir!',
        '✓ Günlük 2.5-3 lt su tüketilmelidir!',
        `✓ Ergojenik etki için günlük kafein tüketimi ${Math.round(weight * 3)}-${Math.round(weight * 6)} mg arasında olmalıdır!<br><span class="text-gray-400 text-sm">Referans: 65 (ml) Türk kahvesi ≈ 60mg, Double Shot Espresso ≈ 120mg kafein</span>`
    ];

    // Beslenme notlarını göster
    const notesList = document.getElementById('beslenmeNotlari');
    nutritionNotes.forEach(note => {
        const li = document.createElement('li');
        li.className = 'bg-dark-primary/50 p-4 rounded-lg flex items-start gap-2';
        li.innerHTML = `
            <span class="text-amber-500 mt-1">${note.startsWith('❑') ? '❑' : '✓'}</span>
            <span class="text-gray-300">${note.substring(2)}</span>
        `;
        notesList.appendChild(li);
    });

    // Genel önerileri göster
    const recommendationsList = document.getElementById('genelOneriler');
    generalRecommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.className = 'bg-dark-primary/50 p-4 rounded-lg flex items-start gap-2';
        li.innerHTML = `
            <span class="text-emerald-500 mt-1">${recommendation.startsWith('✓') ? '✓' : '❑'}</span>
            <span class="text-gray-300">${recommendation.substring(2)}</span>
        `;
        recommendationsList.appendChild(li);
    });
}

// İndirme butonu için event listener
document.getElementById('indirButton').addEventListener('click', function() {
    // İndirme butonunu geçici olarak gizle
    const downloadButton = document.getElementById('indirButton');
    const hesaplaButton = document.getElementById('hesaplaButton');
    const originalDisplay = downloadButton.style.display;
    downloadButton.style.display = 'none';
    hesaplaButton.style.display = 'none';
    
    // Sayfanın HTML içeriğini al
    const htmlContent = document.documentElement.outerHTML;
    
    // Butonları tekrar göster
    downloadButton.style.display = originalDisplay;
    hesaplaButton.style.display = originalDisplay;
    
    // HTML içeriğini Blob'a dönüştür
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // İndirme linki oluştur
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beslenme_programi.html';
    
    // Linki tıkla ve temizle
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

// Tekrar hesapla butonu için event listener
document.getElementById('hesaplaButton').addEventListener('click', function() {
    window.location.href = 'index.html';
}); 