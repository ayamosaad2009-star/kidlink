<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <title>KidLink - Heart Rate</title>
</head>
<body>import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSy...", // حط مفتاحك هنا
    databaseURL: "https://kidlink-45e11-default-rtdb.firebaseio.com",
    projectId: "Kidlink-45e11",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// حركة التحدي: أول ما الموقع يفتح، هيخلي القيمة 0 ويقف تماماً
set(ref(db, 'HEARTRATE'), 0);

onValue(ref(db, 'HEARTRATE'), (snapshot) => {
    const value = snapshot.val();
    document.getElementById("heartRateText").innerText = value;
});
   
        </div>
    </div>
    <script type="module" src="firebase-config.js"></script>
</body>
</html>
</body>
</html>
