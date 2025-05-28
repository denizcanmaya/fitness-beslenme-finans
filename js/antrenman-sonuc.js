document.addEventListener('DOMContentLoaded', function() {
    try {
        // Form verilerini localStorage'dan al
        const formData = JSON.parse(localStorage.getItem('antrenmanFormData'));
        if (!formData) {
            throw new Error('Form verileri bulunamadı');
        }

        // Program bilgilerini göster
        document.getElementById('gender').textContent = formData.gender === 'male' ? 'Erkek' : 'Kadın';
        document.getElementById('level').textContent = getLevelText(formData.level);
        document.getElementById('programStyle').textContent = getProgramStyleText(formData.programStyle);
        document.getElementById('days').textContent = `${formData.days} Gün`;

        // Antrenman programını oluştur
        const workoutPlan = createWorkoutPlan(formData);
        displayWorkoutPlan(workoutPlan);

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
            a.download = 'antrenman_programi.html';
            
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

    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu: ' + error.message);
        window.location.href = 'index.html';
    }
});

function getLevelText(level) {
    switch (level) {
        case 'beginner': return 'Başlangıç';
        case 'intermediate': return 'Orta Seviye';
        case 'advanced': return 'İleri Seviye';
        default: return level;
    }
}

function getProgramStyleText(style) {
    switch (style) {
        case 'fullbody': return 'Full Body';
        case 'ppl': return 'Push Pull Legs';
        default: return style;
    }
}

// Egzersiz veritabanı

const exerciseDatabase = {
    chest: {
        beginner: ['Dumbbell Chest Press', 'Machine Chest Press', 'Incline Machine Press', 'Pec Deck', 'Knee Push-Up'],
        intermediate: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Cable Fly', 'Dips (assisted)', 'Decline Dumbbell Press'],
        advanced: ['Weighted Dips', 'Incline Barbell Press', 'Decline Bench Press', 'Cable Crossovers', 'Dumbbell Squeeze Press']
    },
    back: {
        beginner: ['Lat Pulldown', 'Seated Cable Row', 'Machine Row', 'Resistance Band Row', 'TRX Row'],
        intermediate: ['Pull-Up (assisted)', 'Barbell Bent-Over Row', 'T-Bar Row', 'One Arm Dumbbell Row', 'Cable Row'],
        advanced: ['Weighted Pull-Up', 'Deadlift', 'Chest-Supported Row', 'Inverted Row', 'Meadows Row']
    },
    legs: {
        beginner: ['Bodyweight Squat', 'Leg Press Machine', 'Leg Curl Machine', 'Leg Extension', 'Glute Bridge'],
        intermediate: ['Barbell Squat', 'Romanian Deadlift', 'Walking Lunges', 'Bulgarian Split Squat', 'Hack Squat'],
        advanced: ['Front Squat', 'Nordic Curl', 'Single Leg Press', 'Jefferson Squat', 'Pistol Squat']
    },
    shoulders: {
        beginner: ['Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Lateral Raise', 'Front Raise', 'Face Pull'],
        intermediate: ['Arnold Press', 'Cable Lateral Raise', 'Upright Row', 'Rear Delt Fly', 'Dumbbell Lateral Raise'],
        advanced: ['Push Press', 'Behind the Neck Press', 'Cuban Press', 'Barbell Overhead Press', 'Single Arm Dumbbell Press']
    },
    biceps: {
        beginner: ['Dumbbell Bicep Curl', 'Cable Curl', 'Machine Bicep Curl'],
        intermediate: ['Barbell Curl', 'Incline Dumbbell Curl', 'Concentration Curl'],
        advanced: ['Preacher Curl', 'Spider Curl', 'Zottman Curl']
    },
    triceps: {
        beginner: ['Dumbbell Tricep Kickback', 'Tricep Rope Pushdown', 'Machine Tricep Extension'],
        intermediate: ['Skull Crusher', 'Overhead Dumbbell Extension', 'Close-Grip Push-Up'],
        advanced: ['Close-Grip Bench Press', 'French Press', 'Weighted Dips']
    },
    glutes: {
        beginner: ['Glute Bridge', 'Hip Abduction Machine', 'Kickbacks (band/cable)', 'Step-Up (bodyweight)', 'Leg Press (Glute Focus)'],
        intermediate: ['Hip Thrust (barbell)', 'Bulgarian Split Squat', 'Cable Kickbacks', 'Walking Lunge', 'Sumo Squat'],
        advanced: ['Barbell Hip Thrust', 'Single Leg Glute Bridge', 'Glute Ham Raise', 'Curtsy Lunge', 'Banded Squat Walk']
    },
    core: {
        beginner: ['Crunch', 'Leg Raise', 'Plank'],
        intermediate: ['Cable Crunch', 'Hanging Leg Raise', 'Russian Twist'],
        advanced: ['Dragon Flag', 'Toes to Bar', 'Weighted Plank']
    }
};


// Program şablonları
const workoutTemplates = {
    fullbody: {
        male: {
            upperFocus: {
                chest: 1,
                back: 1,
                legs: 1,
                shoulders: 1,
                biceps: 1,
                triceps: 1
            },
            lowerFocus: {
                legs: 3,
                glutes: 2,
                core: 1,
            },
            fullBody: {
                chest: 1,
                back: 1,
                legs: 1,
                shoulders: 1,
                arms: 2
            }
        },
        female: {
            upperFocus: {
                chest: 1,
                back: 1,
                legs: 1,
                shoulders: 1,
                biceps: 1,
                triceps: 1
            },
            lowerFocus: {
                legs: 3,
                glutes: 2,
                core: 1,
            },
            fullBody: {
                chest: 1,
                back: 1,
                legs: 1,
                shoulders: 1,
                arms: 2 
            }
        }
    },
    ppl: {
        male: {
            push1: {
                chest: 3,
                shoulders: 2,
                triceps: 2
            },
            pull1: {
                back: 3,
                biceps: 2,
                core: 2
            },
            legs1: {
                legs: 4,
                glutes: 2
            },
            fullBody: {
                chest: 1,
                back: 1,
                legs: 1,
                shoulders: 1,
                biceps: 1,
                triceps: 1
            }
        },
        female: {
            push1: {
                chest: 2,
                shoulders: 2,
                triceps: 2
            },
            pull1: {
                back: 3,
                biceps: 2,
                core: 2
            },
            legs1: {
                legs: 3,
                glutes: 3
            },
            fullBody: {
                chest: 1,
                back: 1,
                legs: 1,
                shoulders: 1,
                biceps: 1,
                triceps: 1
            }
        }
    }
};



function createWorkoutPlan(formData) {
    const { gender, level, programStyle, days } = formData;
    
    // Program oluşturma
    let plan = [];
    if (programStyle === 'fullbody') {
        // Full Body programı için günleri oluştur
        const dayTemplates = {
            2: ['upperFocus', 'lowerFocus'],
            3: ['upperFocus', 'lowerFocus', 'fullBody'],
            4: ['upperFocus', 'lowerFocus', 'fullBody', 'upperFocus']
        };
        
        const selectedDays = dayTemplates[days];
        selectedDays.forEach((dayType, index) => {
            const template = workoutTemplates.fullbody[gender][dayType];
            const exercises = [];
            
            for (const [muscle, count] of Object.entries(template)) {
                const muscleExercises = getUniqueExercises(muscle, level, count);
                muscleExercises.forEach(ex => {
                    exercises.push({
                        name: ex,
                        sets: getSetCount(level),
                        reps: getRepRange(level, muscle),
                        rest: getRestTime(level)
                    });
                });
            }
            
            plan.push({
                day: index + 1,
                type: getDayFocus(dayType),
                exercises: exercises
            });
        });
    } else {
        // PPL programı için günleri oluştur
        const dayTemplates = {
            2: ['push1', 'pull1'],
            3: ['push1', 'pull1', 'legs1'],
            4: ['push1', 'pull1', 'legs1', 'fullBody']
        };
        
        const selectedDays = dayTemplates[days];
        selectedDays.forEach((dayType, index) => {
            const template = workoutTemplates.ppl[gender][dayType];
            const exercises = [];
            
            for (const [muscle, count] of Object.entries(template)) {
                const muscleExercises = getUniqueExercises(muscle, level, count);
                muscleExercises.forEach(ex => {
                    exercises.push({
                        name: ex,
                        sets: getSetCount(level),
                        reps: getRepRange(level, muscle),
                        rest: getRestTime(level)
                    });
                });
            }
            
            plan.push({
                day: index + 1,
                type: getDayFocus(dayType),
                exercises: exercises
            });
        });
    }
    
    return plan;
}

function getUniqueExercises(muscle, level, count) {
    if (muscle === 'arms') {
        // biceps ve triceps'ten eşit sayıda seç
        const half = Math.floor(count / 2);
        const bicepsCount = half;
        const tricepsCount = count - bicepsCount;

        const bicepsExercises = [...exerciseDatabase['biceps'][level]];
        const tricepsExercises = [...exerciseDatabase['triceps'][level]];

        const selected = [];

        for (let i = 0; i < bicepsCount; i++) {
            if (bicepsExercises.length === 0) break;
            const randomIndex = Math.floor(Math.random() * bicepsExercises.length);
            selected.push(bicepsExercises.splice(randomIndex, 1)[0]);
        }

        for (let i = 0; i < tricepsCount; i++) {
            if (tricepsExercises.length === 0) break;
            const randomIndex = Math.floor(Math.random() * tricepsExercises.length);
            selected.push(tricepsExercises.splice(randomIndex, 1)[0]);
        }

        return selected;
    }

    // Diğer kas grupları için standart seçim
    const allExercises = [...(exerciseDatabase[muscle]?.[level] || [])];
    const selected = [];

    for (let i = 0; i < count; i++) {
        if (allExercises.length === 0) break;
        const randomIndex = Math.floor(Math.random() * allExercises.length);
        selected.push(allExercises.splice(randomIndex, 1)[0]);
    }

    return selected;
}

function getSetCount(level) {
    switch (level) {
        case 'beginner': return 3;
        case 'intermediate': return 4;
        case 'advanced': return 5;
        default: return 3;
    }
}

function getRepRange(level, muscle) {
    if (muscle === 'legs' || muscle === 'glutes') {
        switch (level) {
            case 'beginner': return '12-15';
            case 'intermediate': return '10-12';
            case 'advanced': return '8-10';
            default: return '10-12';
        }
    }
    
    switch (level) {
        case 'beginner': return '12-15';
        case 'intermediate': return '10-12';
        case 'advanced': return '8-10';
        default: return '12-15';
    }
}

function getRestTime(level) {
    switch (level) {
        case 'beginner': return '60 sn';
        case 'intermediate': return '90 sn';
        case 'advanced': return '120 sn';
        default: return '60 sn';
    }
}

function getDayFocus(day) {
    const focuses = {
        upperFocus: 'Üst Vücut Odaklı',
        lowerFocus: 'Alt Vücut Odaklı',
        fullBody: 'Tüm Vücut',
        push1: 'Göğüs Odaklı İtme',
        pull1: 'Sırt Odaklı Çekme',
        legs1: 'Bacak'
    };
    return focuses[day] || day;
}

function displayWorkoutPlan(plan) {
    const container = document.getElementById('workoutPlan');
    
    plan.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.className = 'bg-dark-primary/50 rounded-lg p-6';
        
        let title = `Gün ${day.day}`;
        if (day.type) {
            title += ` - ${day.type}`;
        }
        
        dayCard.innerHTML = `
            <h4 class="text-xl font-semibold mb-4">${title}</h4>
            <div class="space-y-4">
                ${day.exercises.map(exercise => `
                    <div class="bg-dark-secondary/50 p-4 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-medium">${exercise.name}</span>
                            <span class="text-gray-400">${exercise.sets} Set</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-400">
                            <span>${exercise.reps} Tekrar</span>
                            <span>${exercise.rest} Dinlenme</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.appendChild(dayCard);
    });
} 