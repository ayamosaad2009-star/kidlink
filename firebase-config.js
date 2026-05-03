<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <title>KidLink - Heart Rate</title>
</head>
<body>
    let readings = []; // مصفوفة عشان نجمع فيها القراءات ونحسب المتوسط

function processStream(pulseValue) {
    // 1. التأكد إن فيه صباع مغطي الكاميرا (اللون الأحمر عالي)
    if (pulseValue > 10) { 
        readings.push(pulseValue);

        // 2. لما نجمع 10 قراءات، نحسب المتوسط عشان الرقم يثبت
        if (readings.length >= 10) {
            let average = readings.reduce((a, b) => a + b) / readings.length;
            let finalBPM = Math.round(average);

            // 3. نبعت لـ Firebase فقط لو الرقم منطقي (بين 60 و 120 مثلاً)
            if (finalBPM > 60 && finalBPM < 120) {
                set(ref(db, 'HEARTRATE'), finalBPM);
                
                // إظهار علامة الصح اللي طلبتها
                const mark = document.getElementById("successMark");
                if(mark) mark.style.display = "block";
            }
            readings = []; // نصفر المصفوفة عشان القراءة اللي بعدها
        }
    } else {
        // لو صباعك مش محطوط، يصفر القراءات وما يبعتش أرقام عشوائية
        readings = [];
    }
}
   
        </div>
    </div>
    <script type="module" src="firebase-config.js"></script>
</body>
</html>
</body>
</html>
