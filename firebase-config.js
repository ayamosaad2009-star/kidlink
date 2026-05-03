
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. بيانات مشروعك (انسخها من Project Settings في Firebase)
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  databaseURL: "https://kidlink-45e11-default-rtdb.firebaseio.com",
  projectId: "kidlink-45e11",
};

// 3. بدء التشغيل
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 4. سحب نبض القلب (Heart Rate) وعرضه في موقعك
const heartRateRef = ref(db, 'heartRate'); 
onValue(heartRateRef, (snapshot) => {
    const value = snapshot.val();
    // تأكد إن الرقم في صفحة الـ HTML عندك واخد id="heartRateText"
    const element = document.getElementById("heartRateText");
    if (element) {
        element.innerText = value + " BPM";
    }
});
