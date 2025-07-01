import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Translations object for multilingual support
const translations = {
    en: {
        appTitle: "Aina Waradat", // Changed app title
        chooseSurahs: "Choose Surahs or Juz's",
        selectSurahs: "Select Surahs",
        selectJuzs: "Select Juz's",
        prepareAyahsButton: "Prepare Ayahs",
        preparing: "Preparing...",
        startQuizButton: "Start Quiz",
        getNewAyahButton: "New Ayah", // Changed text as per request
        listenButton: "Listen",
        pauseButton: "Pause",
        enterSurahPlaceholder: "Enter Surah name (e.g., Al-Fatiha)",
        submitGuessButton: "Submit Guess",
        revealAnswerButton: "Reveal Answer",
        returnToMainMenuButton: "Return to Main Menu",
        messageNoAyahsPrepared: "No ayahs prepared. Please return to selection and choose some.",
        messageGuessSurah: "Guess the Surah this Ayah belongs to!",
        messageCorrect: "Correct! Well done!",
        messageIncorrect: "Incorrect. Try again or reveal the answer.", // Changed for retry flow
        messageReveal: "The correct Surah was",
        messageNoAudio: "No audio available for this Ayah or Ayah not selected.",
        messageNoAyahsSelected: "Please select at least one Surah or Juz to prepare.",
        messageMinimumSurahs: "Please select at least two Surahs.", // Updated message
        messageReadyToStart: "Ready to start! %s ayahs selected.", // Placeholder for count
        messageFetchingData: "Fetching Quran data. This might take a moment...",
        messageCouldNotGetAyah: "Could not get a random ayah. Please try again.",
        pointsLabel: "Points",
        viewOnQuranCom: "View on Quran.com",
        roundRestarted: "All ayahs answered! Shuffling and starting a new round.",
        ayahLabel: "Ayah", // Added for consistent display of Ayah number
        juzLabel: "Juz'", // Added for consistent display of Juz number
        supportWork: "Support my work!", // New translation for donation message
        copyrightInfo: "Copyright © 2025 Aina Waradat", // English copyright info
        hintButton: "Hint", // New translation for hint button
        messageInvalidSurahName: "Please use menu to choose answer!", // New translation for invalid surah name
        juzs: {
            1: "Juz' 1", 2: "Juz' 2", 3: "Juz' 3", 4: "Juz' 4", 5: "Juz' 5",
            6: "Juz' 6", 7: "Juz' 7", 8: "Juz' 8", 9: "Juz' 9", 10: "Juz' 10",
            11: "Juz' 11", 12: "Juz' 12", 13: "Juz' 13", 14: "Juz' 14", 15: "Juz' 15",
            16: "Juz' 16", 17: "Juz' 17", 18: "Juz' 18", 19: "Juz' 19", 20: "Juz' 20",
            21: "Juz' 21", 22: "Juz' 22", 23: "Juz' 23", 24: "Juz' 24", 25: "Juz' 25",
            26: "Juz' 26", 27: "Juz' 27", 28: "Juz' 28", 29: "Juz' 29", 30: "Juz' 30",
        }
    },
    ar: {
        appTitle: "أَيْنَ وَرَدَتْ", // Changed app title with tashkeel
        chooseSurahs: "اختر السور أو الأجزاء",
        selectSurahs: "اختر السور",
        selectJuzs: "اختر الأجزاء",
        prepareAyahsButton: "تجهيز الآيات",
        preparing: "جاري التحضير",
        startQuizButton: "بدء الاختبار",
        getNewAyahButton: "آية جديدة", // Changed text as per request
        listenButton: "استماع",
        pauseButton: "إيقاف مؤقت",
        enterSurahPlaceholder: "أدخل اسم السورة (مثال: الفاتحة)",
        submitGuessButton: "تأكيد الإجابة",
        revealAnswerButton: "كشف الإجابة",
        returnToMainMenuButton: "العودة إلى القائمة الرئيسية",
        messageNoAyahsPrepared: "لم يتم تجهيز آيات. يرجى العودة للاختيار",
        messageGuessSurah: "خَمِّن السورة التي وردت فيها هذه الآية",
        messageCorrect: "!صحيح! أحسنت",
        messageIncorrect: "غير صحيح. حاول مرة أخرى أو اكشف الإجابة", // Changed for retry flow
        messageReveal: "السورة الصحيحة هي",
        messageNoAudio: "لا يوجد صوت لهذه الآية أو لم يتم اختيار آية",
        messageNoAyahsSelected: "الرجاء اختيار سورة واحدة على الأقل أو جزء للتحضير",
        messageMinimumSurahs: "الرجاء اختيار سورتين على الأقل", // Updated message
        messageReadyToStart: "جاهز للبدء! تم اختيار %s آيات", // Corrected pluralization
        messageFetchingData: "جاري التحميل",
        messageCouldNotGetAyah: "تعذر الحصول على آية عشوائية. الرجاء المحاولة مرة أخرى",
        pointsLabel: "النقاط",
        viewOnQuranCom: "عرض على Quran.com",
        roundRestarted: "تم الإجابة على جميع الآيات! جاري الترتيب العشوائي وبدء جولة جديدة",
        ayahLabel: "آية", // Added for consistent display of Ayah number
        juzLabel: "الجزء", // Added for consistent display of Juz number
        supportWork: "ادعم صانع التطبيق", // New translation for donation message
        copyrightInfo: "حقوق النشر © 2025 أَيْنَ وَرَدَتْ", // Arabic copyright info
        hintButton: "تلميح", // New translation for hint button
        messageInvalidSurahName: "!الرجاء استخدام القائمة لاختيار الإجابة", // New translation for invalid surah name
        juzs: {
            1: "الجزء ١", 2: "الجزء ٢", 3: "الجزء ٣", 4: "الجزء ٤", 5: "الجزء ٥",
            6: "الجزء ٦", 7: "الجزء ٧", 8: "الجزء ٨", 9: "الجزء ٩", 10: "الجزء ١٠",
            11: "الجزء ١١", 12: "الجزء ١٢", 13: "الجزء ١٣", 14: "الجزء ١٤", 15: "الجزء ١٥",
            16: "الجزء ١٦", 17: "الجزء ١٧", 18: "الجزء ١٨", 19: "الجزء ١٩", 20: "الجزء ٢٠",
            21: "الجزء ٢١", 22: "الجزء ٢٢", 23: "الجزء ٢٣", 24: "الجزء ٢٤", 25: "الجزء ٢٥",
            26: "الجزء ٢٦", 27: "الجزء ٢٧", 28: "الجزء ٢٨", 29: "الجزء ٢٩", 30: "الجزء ٣٠",
        }
    },
};

// Hardcoded array for the first ayah of each Surah, with Basmalah handled
// For Surah 1, Ayah 1 is its full text including Basmalah.
// For Surahs 2-114, Ayah 1 excludes Basmalah.
const firstAyahPrompts = {
    1: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    2: "الم",
    3: "الم",
    4: "يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمُ ٱلَّذِى خَلَقَكُم مِّن نَّفْسٍ وَٰحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا وَبَثَّ مِنْهُمَا رِجَالًا كَثِيرًا وَنِسَآءً ۚ وَٱتَّقُوا۟ ٱللَّهَ ٱٱلَّذِى تَسَآءَلُونَ بِهِۦ وَٱلْأَرْحَامَ ۚ إِنَّ ٱلَّلَهَ كَانَ عَلَيْكُمْ رَقِيبًا",
    5: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَوْفُوا۟ بِٱلْعُقُودِ ۚ أُحِلَّتْ لَكُم بَهِيمَةُ ٱلْأَنْعَٰمِ إِلَّا مَا يُتْلَىٰ عَلَيْكُمْ غَيْرَ مُحِلِّى ٱلصَّيْدِ وَأَنتُمْ حُرُمٌ ۗ إِنَّ ٱلَّلَهَ يَحْكُمُ مَا يُرِيدُ",
    6: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِى خَلَقَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ وَجَعَلَ ٱلظُّلُمَٰتِ وَٱلنُّورَ ۖ ثُمَّ ٱلَّذِينَ كَفَرُوا۟ بِرَبِّهِمْ يَعْدِلُونَ",
    7: "المص",
    8: "يَسْـَٔلُونَكَ عَنِ ٱلْأَنفَالِ ۖ قُلِ ٱلْأَنفَالُ لِلَّهِ وَٱلرَّسُولِ ۖ فَٱتَّقُوا۟ ٱلَّلَهَ وَأَصْلِحُوا۟ ذَاتَ بَيْنِكُمْ ۖ وَأَطِيعُوا۟ ٱللَّهَ وَرَسُولَهُۥٓ إِن كُنتُم مُّؤْمِنِينَ",
    9: "بَرَآءَةٌ مِّنَ ٱللَّهِ وَرَسُولِهِۦٓ إِلَى ٱلَّذِينَ عَٰهَدتُّم مِّنَ ٱلْمُشْرِكِينَ",
    10: "الر ۚ تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ٱلْحَكِيمِ",
    11: "الر ۚ كِتَٰبٌ أُحْكِمَتْ ءَايَٰتُهُۥ ثُمَّ فُصِّلَتْ مِن لَّدُنْ حَكِيمٍ خَبِيرٍ",
    12: "الر ۚ تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ٱلْمُبِينِ",
    13: "المر ۚ تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ ۗ وَٱٱلَّذِىٓ أُنزِلَ إِلَيْكَ مِن رَّبِّكَ ٱلْحَقُّ وَلَٰكِنَّ أَكْثَرَ ٱلنَّاسِ لَا يُؤْمِنُونَ",
    14: "الر ۚ كِتَٰبٌ أَنزَلْنَٰهُ إِلَيْكَ لِتُخْرِجَ ٱلنَّاسَ مِنَ ٱٱلظُّلُمَٰتِ إِلَى ٱلنُّورِ بِإِذْنِ رَبِّهِمْ إِلَىٰ صِرَٰطِ ٱلْعَزِيزِ ٱلْحَمِيدِ",
    15: "الر ۚ تِلْكَ ءَايَٰتُ ٱلْكِتَٰبِ وَقُرْءَانٍ مُّبِينٍ",
    16: "أَتَىٰٓ أَمْرُ ٱللَّهِ فَلَا تَسْتَعْجِلُوهُ ۚ سُبْحَٰنَهُۥ وَتَعَٰلَىٰ عَمَّا يُشْرِكُونَ",
    17: "سُبْحَٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا مِّنَ ٱلْمَسْجِدِ ٱلْحَرَامِ إِلَى ٱلْمَسْجِدِ ٱلْأَقْصَا ٱلَّذِى بَٰرَكْنَا حَوْلَهُۥ لِنُرِيَهُۥ مِنْ ءَايَٰتِنَآ ۚ إِنَّهُۥ هُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ",
    18: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِىٓ أَنزَلَ عَلَىٰ عَبْدِهِ ٱلْكِتَٰبَ وَلَمْ يَجْعَل لَّهُۥ عِوَجًا ۜ",
    19: "كهيعص",
    20: "طه",
    21: "ٱقْتَرَبَ لِلنَّاسِ حِسَابُهُمْ وَهُمْ فِى غَفْلَةٍ مُّعْرِضُونَ",
    22: "يَٰٓأَيُّهَا ٱلنَّاسُ ٱتَّقُوا۟ رَبَّكُمْ ۚ إِنَّ زَلْزَلَةَ ٱلسَّاعَةِ شَىْءٌ عَظِيمٌ",
    23: "قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ",
    24: "سُورَةٌ أَنزَلْنَٰهَا وَفَرَضْنَٰهَا وَأَنزَلْنَا فِيهَآ ءَايَٰتٍ بَيِّنَٰتٍ لَّعَلَّكُمْ تَذَكَّرُونَ",
    25: "تَبَٰرَكَ ٱلَّذِى نَزَّلَ ٱلْفُرْقَانَ عَلَىٰ عَبْدِهِۦ لِيَكُونَ لِلْعَٰلَمِينَ نَذِيرًا",
    26: "طسٓمٓ",
    27: "طسٓ ۚ تِلْكَ ءَايَٰتُ ٱلْقُرْءَانِ وَكِتَابٍ مُّبِينٍ",
    28: "طسٓمٓ",
    29: "الم",
    30: "الم",
    31: "الم",
    32: "المٓ",
    33: "يَٰٓأَيُّهَا ٱلنَّبِىُّ ٱتَّقِ ٱللَّهَ وَلَا تُطِعِ ٱلْكَٰفِرِينَ وَٱالْمُنَٰفِقِينَ ۗ إِنَّ ٱلَّلَهَ كَانَ عَلِيمًا حَكِيمًا",
    34: "ٱلْحَمْدُ لِلَّهِ ٱلَّذِى لَهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ وَلَهُ ٱلْحَمْدُ فِى ٱلْءَاخِرَةِ ۚ وَهُوَ ٱلْحَكِيمُ ٱلْخَبِيرُ",
    35: "ٱلْحَمْدُ لِلَّهِ فَاطِرِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ جَاعِلِ ٱلْمَلَٰٓئِكَةِ رُسُلًا أُو۟لِىٓ أَجْنِحَةٍ مَّثْنَىٰ وَثُلَٰثَ وَرُبَٰعَ ۚ يَزِيدُ فِى ٱلْخَلْقِ مَا يَشَآءُ ۚ إِنَّ ٱاللَّهَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
    36: "يٓسٓ",
    37: "وَٱلصَّٰفَّٰتِ صَفًّا",
    38: "صٓ ۚ وَٱلْقُرْءَانِ ذِى ٱلذِّكْرِ",
    39: "تَنزِيلُ ٱلْكِتَٰبِ مِنَ ٱاللَّهِ ٱلْعَزِيزِ ٱلْحَكِيمِ",
    40: "حمٓ",
    41: "حمٓ",
    42: "حمٓ",
    43: "حمٓ",
    44: "حمٓ",
    45: "حمٓ",
    46: "حمٓ",
    47: "ٱلَّذِينَ كَفَرُوا۟ وَصَدُّوا۟ عَن سَبِيلِ ٱاللَّهِ أَضَلَّ أَعْمَٰلَهُمْ",
    48: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا",
    49: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُو۟ا۟ لَا تُقَدِّسُوا۟ بَيْنَ يَدَىِ ٱاللَّهِ وَرَسُولِهِۦ ۖ وَٱتَّقُوا۟ ٱاللَّهَ ۚ إِنَّ ٱلَّلَهَ سَمِيعٌ عَلِيمٌ",
    50: "قٓ ۚ وَٱلْقُرْءَانِ ٱلْمَجِيدِ",
    51: "وَٱلذَّٰرِيَٰتِ ذَرْوًا",
    52: "وَٱلطُّورِ",
    53: "وَٱلنَّجْمِ إِذَا هَوَىٰ",
    54: "ٱقْتَرَبَتِ ٱلسَّاعَةُ وَٱنشَقَّ ٱلْقَمَرُ",
    55: "ٱلرَّحْمَٰنُ",
    56: "إِذَا وَقَعَتِ ٱلْوَاقِعَةُ",
    57: "سَبَّحَ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۖ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    58: "قَدْ سَمِعَ ٱاللَّهُ قَوْلَ ٱلَّتِى تُجَٰدِلُكَ فِى زَوْجِهَا وَتَشْتَكِىٓ إِلَى ٱاللَّهِ وَٱاللَّهُ يَسْمَعُ تَحَاوُرَكُمَآ ۚ إِنَّ ٱلَّلَهَ سَمِيعٌ بَصِيرٌ",
    "59": "هُوَ ٱلَّذِىٓ أَخْرَجَ ٱلَّذِينَ كَفَرُوا۟ مِنْ أَهْلِ ٱلْكِتَٰبِ مِن دِيَٰرِهِمْ لِأَوَّلِ ٱلْحَشْرِ ۚ مَا ظَنَنتُمْ أَن يَخْرُجُوا۟ ۖ وَظَنُّوٓا۟ أَنَّهُم مَّانِعَتُهُم حُصُونُهُم مِّنَ ٱاللَّهِ فَأَتَىٰهُمُ ٱاللَّهُ مِن حَيْثُ لَمْ يَحْتَسِبُوا۟ ۖ وَقَذَفَ فِى قُلُوبِهِمُ ٱلرُّعْبَ ۚ يُخْرِبُونَ بُيُوتَهُم بِأَيْدِيهِمْ وَأَيْدِى ٱلْمُؤْمِنِينَ فَٱعْتَبِرُوا۟ يَٰٓأُو۟لِى ٱلْأَبْصَٰرِ",
    "60": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ لَا تَتَّخِذُوا۟ عَدُوِّى وَعَدُوَّكُمْ أَوْلِيَآءَ تُلْقُونَ إِلَيْهِم بِٱٱلْمَوَدَّةِ وَقَدْ كَفَرُوا۟ بِمَا جَآءَكُم مِّنَ ٱلْحَقِّ يُخْرِجُونَ ٱلرَّسُولَ وَإِيَّاكُمْ ۙ أَن تُؤْمِنُوا۟ بِٱاللَّهِ رَبِّكُمْ إِن كُنتُمْ خَرَجْتُمْ جِهَٰدًا فِى سَبِيلِى وَٱبْتِغَآءَ مَرْضَاتِى ۚ تُسِرُّونَ إِلَيْهِم بِٱٱلْمَوَدَّةِ وَأَنَا۠ أَعْلَمُ بِمَآ أَخْفَيْتُمْ وَمَآ أَصْلَحْتُمْ ۚ وَمَن يَفْعَلْهُ مِنكُمْ فَقَدْ ضَلَّ سَوٓاءَ ٱلسَّبِيلِ",
    "61": "سَبَّحَ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۖ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    "62": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا نُودِىَ لِلصَّلَوٰةِ مِن يَوْمِ ٱلْجُمُعَةِ فَٱسْعَوْا۟ إِلَىٰ ذِكْرِ ٱللَّهِ وَذَرُوا۟ ٱلْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ",
    "63": "إِذَا جَآءَكَ ٱلْمُنَٰفِقُونَ قَالُوا۟ نَشْهَدُ إِنَّكَ لَرَسُولُ ٱللَّهِ ۗ وَٱاللَّهُ يَعْلَمُ إِنَّكَ لَرَسُولُهُۥ وَٱاللَّهُ يَشْهَدُ إِنَّ ٱلْمُنَٰفِقِينَ لَكَٰذِبُونَ",
    "64": "يُسَبِّحُ لِلَّهِ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۖ لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ ۖ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
    "65": "يَٰٓأَيُّهَا ٱلنَّبِىُّ إِذَا طَلَّقْتُمُ ٱلنِّسَآءَ فَطَلِّقُوهُنَّ لِعِدَّتِهِنَّ وَأَحْصُوا۟ ٱلْعِدَّةَ ۖ وَٱتَّقُوا۟ ٱللَّهَ رَبَّكُمْ ۖ لَا تُخْرِجُوهُنَّ مِنۢ بُيُوتِهِنَّ وَلَا يَخْرُجْنَ إِلَّآ أَن يَأْتِينَ بِفَٰحِشَةٍ مُّبَيِّنَةٍ ۚ وَتِلْكَ حُدُودُ ٱاللَّهِ ۚ وَمَن يَتَعَدَّ حُدُودَ ٱاللَّهِ فَقَدْ ظَلَمَ نَفْسَهُۥ ۚ لَا تَدْرِى لَعَلَّ ٱاللَّهَ يُحْدِثُ بَعْدَ ذَٰلِكَ أَمْرًا",
    "66": "يَٰٓأَيُّهَا ٱلنَّبِىُّ لِمَ تُحَرِّمُ مَآ أَحَلَّ ٱاللَّهُ لَكَ ۖ تَبْتَغِى مَرْضَاتَ أَزْوَٰجِكَ ۚ وَٱاللَّهُ غَفُورٌ رَّحِيمٌ",
    "67": "تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
    "68": "نٓ ۚ وَٱلْقَلَمِ وَمَا يَسْطُرُونَ",
    "69": "ٱلْحَآقَّةُ",
    "70": "سَأَلَ سَآئِلٌۢ بِعَذَابٍ وَاقِعٍ",
    "71": "إِنَّآ أَرْسَلْنَا نُوحًا إِلَىٰ قَوْمِهِۦٓ أَنفِرُوا۟ قَوْمَكَ مِن قَبْلِ أَن يَأْتِيَهُمْ عَذَابٌ أَلِيمٌ",
    72: "قُلْ أُوحِىَ إِلَىَّ أَنَّهُ ٱسْتَمَعَ نَفَرٌ مِّنَ ٱلْجِنِّ فَقَالُوٓا۟ إِنَّا سَمِعْنَا قُرْءَانًا عَجَبًا",
    73: "يَٰٓأَيُّهَا ٱلْمُزَّمِّلُ",
    74: "يَٰٓأَيُّهَا ٱلْمُدَّثِّرُ",
    75: "لَآ أُقْسِمُ بِيَوْمِ ٱلْقِيَٰمَةِ",
    76: "هَلْ أَتَىٰ عَلَى ٱلْإِنسَٰنِ حِينٌ مِّنَ ٱلدَّهْرِ لَمْ يَكُن شَىْـًٔا مَّذْكُورًا",
    77: "وَٱلْمُرْسَلَٰتِ عُرْفًا",
    78: "عَمَّ يَتَسَآءَلُونَ",
    79: "وَٱلنَّٰزِعَٰتِ غَرْقًا",
    80: "عَبَسَ وَتَوَلَّىٰٓ",
    81: "إِذَا ٱلشَّمْسُ كُوِّرَتْ",
    82: "إِذَا ٱلسَّمَآءُ ٱnfطَرَتْ",
    83: "وَيْلٌ لِّلْمُطَفِّفِينَ",
    84: "إِذَا ٱلسَّمَآءُ ٱنشَقَّتْ",
    85: "وَٱلسَّمَآءِ ذَاتِ ٱلْبُرُوجِ",
    86: "وَٱلسَّمَاء وَٱلطَّارِقِ",
    87: "سَبِّحِ ٱسْمَ رَبِّكَ ٱلْأَعْلَى",
    88: "هَلْ أَتَىٰكَ حَدِيثُ ٱلْغَٰشِيَةِ",
    89: "وَٱلْفَجْرِ",
    90: "لَآ أُقْسِمُ بِهَٰذَا ٱلْبَلَدِ",
    91: "وَٱٱلشَّمْسِ وَضُحَىٰهَا",
    92: "وَٱلَّيْلِ إِذَا يَغْشَىٰ",
    93: "وَٱٱلضُّحَىٰ",
    94: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
    95: "وَٱلتِّينِ وَٱلزَّيْتُونِ",
    96: "ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ",
    97: "إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ",
    98: "لَمْ يَكُنِ ٱلَّذِينَ كَفَرُوا۟ مِنْ أَهْلِ ٱلْكِتَٰبِ وَٱلْمُشْرِكِينَ مُنفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ ٱلْبَيِّنَةُ",
    99: "إِذَا زُلْزِلَتِ ٱلْأَرْضُ زِلْزَالَهَا",
    100: "وَٱلْعَٰدِيَٰتِ ضَبْحًا",
    101: "ٱلْقَارِعَةُ",
    102: "أَلْهَىٰكُمُ ٱلتَّكَاثُرُ",
    103: "وَٱلْعَصْرِ",
    104: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ",
    105: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَٰبِ ٱلْفِيلِ",
    106: "لِإِيلَٰفِ قُرَيْشٍ",
    107: "أَرَءَيْتَ ٱلَّذِى يُكَذِّبُ بِٱلدِّينِ",
    108: "إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ",
    109: "قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ",
    110: "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ",
    111: "تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ",
    112: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    113: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
    114: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ"
};


// Main App Component
const App = () => {
    // State variables
    const [language, setLanguage] = useState('ar'); // Default language is Arabic
    const [surahs, setSurahs] = useState([]);
    const [selectedSurahs, setSelectedSurahs] = useState([]);
    const [selectedJuzs, setSelectedJuzs] = useState([]);
    const [allAyahsInSelection, setAllAyahsInSelection] = useState([]); // Master list of all selected ayahs
    const [availableAyahs, setAvailableAyahs] = useState([]); // Ayahs currently available to be picked (no repetition)
    const [wronglyAnsweredAyahs, setWronglyAnsweredAyahs] = useState([]); // Queue for ayahs answered incorrectly
    const [historyAyahs, setHistoryAyahs] = useState([]); // Tracks last 4 unique ayahs presented
    const [currentAyah, setCurrentAyah] = useState(null);
    const [userGuess, setUserGuess] = useState('');
    const [messageKey, setMessageKey] = useState(null); // Stores a key like 'messageMinimumSurahs', 'messageCorrect', etc.
    const [messageParams, setMessageParams] = useState(null); // For parameters like {count: 5}
    const [isCorrect, setIsCorrect] = useState(null); // For correct/incorrect feedback logic
    const [audio] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [correctAnswerRevealed, setCorrectAnswerRevealed] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [points, setPoints] = useState(0);
    const [hintAyah, setHintAyah] = useState(null); // New state for hint ayah
    const [surahSearchTerm, setSurahSearchTerm] = useState(''); // New state for surah search term

    // State to store full Quran data for different editions (fetched once)
    const [quranArabicFull, setQuranArabicFull] = useState(null);
    const [quranEnglishFull, setQuranEnglishFull] = useState(null);
    const [quranTransliterationFull, setQuranTransliterationFull] = useState(null); // This will now come from a new source
    const [quranAudioFull, setQuranAudioFull] = useState(null);

    const surahInputRef = useRef(null);
    const newAyahButtonRef = useRef(null); // Ref for the New Ayah button for autoscroll

    // API Base URLs
    const QURAN_API_BASE_URL = 'https://api.alquran.cloud/v1'; // Main Al Quran Cloud API
    const QURAN_DOT_COM_BASE_URL = 'https://quran.com';
    // New Transliteration API base URL (Al Quran Cloud itself, using a specific edition)
    const QURAN_TRANSLITERATION_API_BASE_URL = 'https://api.alquran.cloud/v1';


    // Ko-fi link for donation
    const KO_FI_LINK = 'https://ko-fi.com/velsket';

    // Function to convert English numbers to Arabic numbers
    const convertToArabicNumbers = (num) => {
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return String(num).split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
    };

    // Helper function to map Juz number to approximate Surah ranges
    const getJuzSurahRanges = useCallback(() => {
        const juzRanges = {
            1: { startSurah: 1, endSurah: 2, endAyah: 141 },
            2: { startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
            3: { startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
            4: { startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
            5: { startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
            6: { startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
            7: { startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
            8: { startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
            9: { startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
            10: { startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
            11: { startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
            12: { startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
            13: { startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
            14: { startSurah: 15, endSurah: 16, endAyah: 128 },
            15: { startSurah: 17, endSurah: 18, endAyah: 74 },
            16: { startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
            17: { startSurah: 21, endSurah: 22, endAyah: 78 },
            18: { startSurah: 23, endSurah: 25, endAyah: 20 },
            19: { startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 59 },
            20: { startSurah: 27, startAyah: 60, endSurah: 29, endAyah: 45 },
            21: { startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
            22: { startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
            23: { startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
            24: { startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
            25: { startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
            26: { startSurah: 46, endSurah: 51, endAyah: 30 },
            27: { startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
            28: { startSurah: 58, endSurah: 66, endAyah: 12 },
            29: { startSurah: 67, endSurah: 77, endAyah: 50 },
            30: { startSurah: 78, endSurah: 114, endAyah: 6 },
        };
        return juzRanges;
    }, []);

    // Function to get the Juz number for a given Surah and Ayah
    const getJuzForAyah = useCallback((surahNumber, ayahNumber) => {
        const juzRanges = getJuzSurahRanges();
        for (const juzNum in juzRanges) {
            const range = juzRanges[juzNum];
            // Check if the surah is within the juz range
            if (surahNumber >= range.startSurah && surahNumber <= range.endSurah) {
                // If it's the start surah of the juz, check ayah start boundary
                if (surahNumber === range.startSurah && ayahNumber < range.startAyah) {
                    continue; // Ayah is before the juz starts in this surah
                }
                // If it's the end surah of the juz, check ayah end boundary
                if (surahNumber === range.endSurah && ayahNumber > range.endAyah) {
                    continue; // Ayah is after the juz ends in this surah
                }
                return parseInt(juzNum); // Found the correct juz
            }
        }
        return null; // Should not happen if data is complete
    }, [getJuzSurahRanges]);


    // Function to strip Arabic tashkeel (diacritics)
    const stripTashkeel = (text) => {
        if (!text) return '';
        // Removed some characters from the regex to allow for better matching of common Arabic names without over-stripping
        // Keeping only common diacritics for removal to be lenient with user input
        return text.replace(/[\u064B-\u065F\u0670\u06D6-\u06DF\u06E0-\u06E4\u06EA-\u06ED]/g, '');
    };

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    // Derived message string for display
    const displayMessage = useMemo(() => {
        if (!messageKey) return '';
        let msg = translations[language][messageKey];
        if (messageKey === 'messageReadyToStart' && messageParams?.count) {
            msg = msg.replace('%s', messageParams.count);
        } else if (messageKey === 'messageReveal' && messageParams?.surahInfo) {
            // Note: messageParams.surahInfo is already formatted with both names
            msg = `${translations[language].messageReveal} ${messageParams.surahInfo}.`;
        } else if (messageKey === 'messageGuessSurah' && messageParams?.reviewAyah) {
            msg = `${translations[language].messageGuessSurah} (${language === 'ar' ? 'مراجعة آية' : 'Review Ayah'})`;
        }
        return msg;
    }, [language, messageKey, messageParams]);

    // Update message color class based on message key
    const messageColorClass = useMemo(() => {
        if (messageKey === 'messageCorrect') return 'bg-green-100 text-green-700';
        if (messageKey === 'messageIncorrect' || messageKey === 'messageMinimumSurahs' || messageKey === 'messageNoAyahsSelected' || messageKey === 'messageCouldNotGetAyah' || messageKey === 'messageInvalidSurahName') return 'bg-red-100 text-red-700';
        if (messageKey === 'messageReadyToStart' || messageKey === 'preparing' || messageKey === 'messageFetchingData' || messageKey === 'roundRestarted' || messageKey === 'messageReveal') return 'bg-blue-100 text-blue-700';
        return ''; // Default/no special styling
    }, [messageKey]);

    // Effect for clearing messages (only for those that should auto-clear)
    useEffect(() => {
        if (messageKey) {
            const autoClearableMessages = [
                'messageCorrect',
                'messageIncorrect',
                'messageNoAudio',
                'messageCouldNotGetAyah',
                'messageGuessSurah', // Make sure this also clears after a while if not acted upon
                'messageReadyToStart', // This one should clear after quiz starts
                'roundRestarted', // This one too
                'messageReveal', // This one too after it's revealed and user takes no action
                'messageInvalidSurahName',
            ];
            // Only auto-clear if the message is one of the auto-clearable types AND it's not a persistent message
            // Persistent messages are 'messageMinimumSurahs' and 'messageNoAyahsSelected'
            if (autoClearableMessages.includes(messageKey)) {
                const timer = setTimeout(() => {
                    setMessageKey(null);
                    setMessageParams(null);
                    setIsCorrect(null); // Also clear isCorrect state for feedback messages
                }, 5000); // Clear after 5 seconds
                return () => clearTimeout(timer);
            }
        }
    }, [messageKey]);


    // Fetch list of all surahs (metadata only) on component mount
    useEffect(() => {
        const fetchSurahsMetadata = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${QURAN_API_BASE_URL}/surah`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const loadedSurahs = data.data.map(surah => ({
                    id: surah.number,
                    name: surah.englishName,
                    arabicName: surah.name,
                    arabicNameStripped: stripTashkeel(surah.name), // Store stripped version for matching
                    totalAyah: surah.numberOfAyahs,
                }));
                setSurahs(loadedSurahs);
            } catch (error) {
                console.error("Error fetching surahs metadata:", error);
                setMessageKey('messageCouldNotGetAyah'); // Changed to a more general error message
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurahsMetadata();
    }, [language]); // Depend on language to refetch surah metadata if needed, though unlikely to change.

    // Filtered surah options for the dropdown based on user input for main menu search bar
    const filteredSurahsForSearch = useMemo(() => {
        if (!surahSearchTerm) {
            return surahs; // If no search term, return all surahs
        }
        const searchTermStripped = stripTashkeel(surahSearchTerm).toLowerCase();
        return surahs.filter(s =>
            s.name.toLowerCase().includes(searchTermStripped) ||
            s.arabicNameStripped.toLowerCase().includes(searchTermStripped) ||
            String(s.id).includes(surahSearchTerm.toLowerCase()) // Allow searching by surah number
        );
    }, [surahs, surahSearchTerm]);

    // Filtered surah options for the guess input dropdown (quiz area)
    const filteredSurahGuesses = useMemo(() => {
        if (!userGuess) {
            return []; // No guess, no suggestions
        }
        const guessStripped = stripTashkeel(userGuess).toLowerCase().trim();

        // This logic is now identical to filteredSurahsForSearch for consistency
        return surahs.filter(s =>
            s.name.toLowerCase().includes(guessStripped) ||
            s.arabicNameStripped.toLowerCase().includes(guessStripped) ||
            String(s.id).includes(guessStripped)
        );
    }, [surahs, userGuess]);


    // Handles Surah selection checkbox change
    const handleSurahSelect = (surahId, isChecked) => {
        setSelectedSurahs(prev => {
            const newSelection = isChecked ? [...prev, surahId] : prev.filter(id => id !== surahId);
            // Clear specific instructional messages on change, they will reappear if conditions still met
            if (messageKey === 'messageMinimumSurahs' || messageKey === 'messageNoAyahsSelected') {
                setMessageKey(null);
                setMessageParams(null);
            }
            return newSelection;
        });
        setIsCorrect(null); // Clear correct/incorrect status on selection change
    };

    // Handles Juz selection checkbox change
    const handleJuzSelect = (juzNumber, isChecked) => {
        setSelectedJuzs(prev => {
            const newSelection = isChecked ? [...prev, juzNumber] : prev.filter(num => num !== juzNumber);
            // Clear specific instructional messages on change
            if (messageKey === 'messageMinimumSurahs' || messageKey === 'messageNoAyahsSelected') {
                setMessageKey(null);
                setMessageParams(null);
            }
            return newSelection;
        });
        setIsCorrect(null); // Clear correct/incorrect status on selection change

        const juzRanges = getJuzSurahRanges();
        const range = juzRanges[juzNumber];

        if (range) {
            setSelectedSurahs(prevSelectedSurahs => {
                let newSelectedSurahs = new Set(prevSelectedSurahs);
                for (let s = range.startSurah; s <= range.endSurah; s++) {
                    if (isChecked) {
                        newSelectedSurahs.add(s);
                    } else {
                        newSelectedSurahs.delete(s);
                    }
                }
                return Array.from(newSelectedSurahs).sort((a, b) => a - b);
            });
        }
    };

    // Prepare all ayahs based on selected Surahs and Juzs
    const prepareAyahs = useCallback(async () => {
        // Clear previous messages first
        setMessageKey(null);
        setMessageParams(null);
        setIsCorrect(null);


        // Consolidated set of selected surahs (from direct selection and juzs)
        const combinedSelectedSurahs = new Set(selectedSurahs);
        const juzRanges = getJuzSurahRanges();

        for (const juzNum of selectedJuzs) {
            const range = juzRanges[juzNum];
            if (range) {
                for (let s = range.startSurah; s <= range.endSurah; s++) {
                    combinedSelectedSurahs.add(s);
                }
            }
        }

        // First check: if no surahs/juzs at all selected
        if (combinedSelectedSurahs.size === 0) {
            setMessageKey('messageNoAyahsSelected');
            setIsLoading(false); // Ensure loading spinner is off
            return;
        }

        // Second check: enforce minimum of two distinct surahs
        if (combinedSelectedSurahs.size < 2) {
            setMessageKey('messageMinimumSurahs');
            setIsLoading(false); // Ensure loading spinner is off and message is visible
            return;
        }


        setIsLoading(true);
        setMessageKey('messageFetchingData');
        try {
            // Fetch all required Quran editions ONCE if not already fetched
            // The Al Quran Cloud API Base URL is already 'https://api.alquran.cloud/v1'
            // We use different edition identifiers for Arabic, English, Transliteration, and Audio
            if (!quranArabicFull || !quranEnglishFull || !quranTransliterationFull || !quranAudioFull) {
                const [arabicRes, englishRes, transliterationRes, audioRes] = await Promise.all([
                    fetch(`${QURAN_API_BASE_URL}/quran/quran-uthmani`), // Arabic Uthmani text
                    fetch(`${QURAN_API_BASE_URL}/quran/en.sahih`),      // English Sahih International translation
                    fetch(`${QURAN_API_BASE_URL}/quran/en.transliteration`), // English Transliteration
                    fetch(`${QURAN_API_BASE_URL}/quran/ar.alafasy`),    // Audio by Alafasy
                ]);

                if (!arabicRes.ok || !englishRes.ok || !transliterationRes.ok || !audioRes.ok) {
                    throw new Error("Failed to fetch full Quran editions from Al Quran Cloud API.");
                }

                setQuranArabicFull((await arabicRes.json()).data.surahs);
                setQuranEnglishFull((await englishRes.json()).data.surahs);
                setQuranTransliterationFull((await transliterationRes.json()).data.surahs); // Adjusted parsing for Al Quran Cloud structure
                setQuranAudioFull((await audioRes.json()).data.surahs);
            }

            // Ensure data is available before proceeding, using current state if already fetched
            const arabicData = quranArabicFull || (await fetch(`${QURAN_API_BASE_URL}/quran/quran-uthmani`).then(res => res.json())).data.surahs;
            const englishData = quranEnglishFull || (await fetch(`${QURAN_API_BASE_URL}/quran/en.sahih`).then(res => res.json())).data.surahs;
            const transliterationData = quranTransliterationFull || (await fetch(`${QURAN_API_BASE_URL}/quran/en.transliteration`).then(res => res.json())).data.surahs; // Adjusted parsing
            const audioData = quranAudioFull || (await fetch(`${QURAN_API_BASE_URL}/quran/ar.alafasy`).then(res => res.json())).data.surahs;

            const ayahsToConsider = [];

            const addedAyahKeys = new Set(); // To prevent duplicate ayahs from being added

            const addAyahIfNew = (surahNum, ayahNum) => {
                const key = `${surahNum}:${ayahNum}`;
                if (addedAyahKeys.has(key)) return;
                addedAyahKeys.add(key);

                const surahMetadata = surahs.find(s => s.id === surahNum);
                if (!surahMetadata) return;

                const arabicSurah = arabicData.find(s => s.number === surahNum);
                const englishSurah = englishData.find(s => s.number === surahNum);
                // Find transliteration ayah from the new data structure (Al Quran Cloud)
                const transliterationSurah = transliterationData.find(s => s.number === surahNum);
                const audioSurah = audioData.find(s => s.number === surahNum);

                let arabicAyah = arabicSurah?.ayahs.find(a => a.numberInSurah === ayahNum);
                const englishAyah = englishSurah?.ayahs.find(a => a.numberInSurah === ayahNum);
                // Extract transliteration text from Al Quran Cloud's ayah object
                const transliterationAyah = transliterationSurah?.ayahs.find(a => a.numberInSurah === ayahNum);
                const transliterationText = transliterationAyah ? transliterationAyah.text : '';

                const audioAyah = audioSurah?.ayahs.find(a => a.numberInSurah === ayahNum);

                if (arabicAyah && englishAyah && transliterationText) { // Changed condition to check for transliterationText
                    let fullArabicText = arabicAyah.text.trim(); // Always keep the full text

                    let quizPromptArabicText = fullArabicText;

                    // Use hardcoded prompt for the first ayah of any surah
                    if (ayahNum === 1 && firstAyahPrompts[surahNum]) {
                        quizPromptArabicText = firstAyahPrompts[surahNum];
                    }
                    // For all other ayahs (not the first), use the full fetched Arabic text.

                    // Ensure the quiz prompt text is not empty after processing
                    if (quizPromptArabicText === '') {
                        console.warn(`Skipping empty quiz prompt for Surah ${surahNum}, Ayah ${ayahNum}.`);
                        return; // Skip if the prompt becomes empty
                    }

                    const juzNumberForAyah = getJuzForAyah(surahNum, ayahNum); // Get Juz number here

                    ayahsToConsider.push({
                        surahNumber: surahNum,
                        surahName: surahMetadata.name,
                        surahNameArabic: surahMetadata.arabicName,
                        surahNameArabicStripped: surahMetadata.arabicNameStripped,
                        totalAyahsInSurah: surahMetadata.totalAyah, // Add total ayahs for hint logic
                        ayahNumber: ayahNum,
                        arabicText: fullArabicText, // Full Arabic text
                        quizPromptArabicText: quizPromptArabicText, // Processed text for display
                        englishTranslation: englishAyah.text,
                        transliteration: transliterationText, // Use the transliteration text directly
                        audioUrl: audioAyah ? audioAyah.audio : null,
                        juzNumber: juzNumberForAyah, // Add juzNumber to the ayah object
                    });
                }
            };

            // Iterate over the combined set of selected surahs
            for (const surahId of Array.from(combinedSelectedSurahs).sort((a,b)=>a-b)) {
                const surahData = surahs.find(s => s.id === surahId);
                if (surahData) {
                    let startAyah = 1;
                    let endAyah = surahData.totalAyah;

                    // Apply Juz-specific ayah range adjustments
                    for (const juzNum of selectedJuzs) {
                        const range = juzRanges[juzNum];
                        if (range && surahId >= range.startSurah && surahId <= range.endSurah) {
                            if (surahId === range.startSurah && range.startAyah) {
                                startAyah = Math.max(startAyah, range.startAyah);
                            }
                            if (surahId === range.endSurah && range.endAyah) {
                                endAyah = Math.min(endAyah, range.endAyah);
                            }
                        }
                    }

                    for (let i = startAyah; i <= endAyah; i++) {
                        addAyahIfNew(surahId, i);
                    }
                }
            }


            setAllAyahsInSelection(ayahsToConsider);
            // Initialize availableAyahs with a shuffled copy of allAyahsInSelection
            setAvailableAyahs(shuffleArray([...ayahsToConsider]));
            setWronglyAnsweredAyahs([]); // Clear previous wrong answers
            setHistoryAyahs([]); // Clear previous history

            // Use .replace('%s', count) for translated message with count
            setMessageKey('messageReadyToStart');
            setMessageParams({ count: ayahsToConsider.length });
            setQuizStarted(true);
            setQuizActive(false);
        } catch (error) {
            console.error("Error preparing ayahs:", error);
            setMessageKey("messageCouldNotGetAyah");
            setQuizStarted(false);
        } finally {
            setIsLoading(false);
        }
    }, [selectedJuzs, selectedSurahs, surahs, quranArabicFull, quranEnglishFull, quranTransliterationFull, quranAudioFull, getJuzSurahRanges, getJuzForAyah, language]); // Added getJuzForAyah to dependencies

    // Starts a new quiz round by picking a random ayah
    const startNewQuizRound = () => {
        if (allAyahsInSelection.length === 0) {
            setMessageKey('messageNoAyahsPrepared');
            setQuizStarted(false);
            return;
        }

        setIsLoading(true);
        setMessageKey(null); // Clear previous message
        setMessageParams(null);
        setIsCorrect(null);
        setUserGuess("");
        setCorrectAnswerRevealed(false);
        setQuizActive(true); // Always start a new round with quiz active
        audio.pause();
        setIsPlaying(false);
        setHintAyah(null); // Clear any previous hint

        let ayahToPresent = null;

        // 1. Prioritize wrongly answered ayahs if they are "old enough" (not in history)
        if (wronglyAnsweredAyahs.length > 0) {
            // Find the first wrongly answered ayah that is NOT in the historyAyahs (last 4 presented)
            const eligibleWrongAyah = wronglyAnsweredAyahs.find(wrongAyah => {
                const isTooRecent = historyAyahs.some(histAyah =>
                    histAyah.surahNumber === wrongAyah.surahNumber &&
                    histAyah.ayahNumber === wrongAyah.ayahNumber
                );
                return !isTooRecent;
            });

            if (eligibleWrongAyah) {
                ayahToPresent = eligibleWrongAyah;
                // Important: Do NOT remove from wronglyAnsweredAyahs here. It's only removed if answered correctly.
                // It stays in the queue until answered correctly.
                setMessageKey('messageGuessSurah');
                setMessageParams({ reviewAyah: true });
            }
        }

        // 2. If no eligible wrongly answered ayah, pick from available new ayahs
        if (!ayahToPresent && availableAyahs.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableAyahs.length);
            ayahToPresent = availableAyahs[randomIndex];
            setAvailableAyahs(prev => prev.filter((_, index) => index !== randomIndex)); // Remove from available
            setMessageKey('messageGuessSurah');
            setMessageParams(null); // Clear reviewAyah param
        }
        // 3. If available new ayahs exhausted AND no eligible wrongly answered ayahs, reset pool
        else if (!ayahToPresent && allAyahsInSelection.length > 0) {
            const shuffledAllAyahs = shuffleArray([...allAyahsInSelection]);
            if (shuffledAllAyahs.length > 0) {
                ayahToPresent = shuffledAllAyahs[0];
                setAvailableAyahs(shuffledAllAyahs.slice(1)); // First ayah goes to current, rest become available
                setMessageKey('roundRestarted');
            } else {
                setMessageKey('messageCouldNotGetAyah');
            }
        }
        // Final fallback if nothing found
        else if (!ayahToPresent) {
            setMessageKey('messageCouldNotGetAyah');
        }

        if (ayahToPresent) {
            setCurrentAyah(ayahToPresent);
            // Always add the presented ayah to history, then truncate to keep only the last 4 unique ones
            setHistoryAyahs(prev => {
                const newHistory = [...prev];
                // Remove if already in history to ensure it moves to the "most recent" position
                const existingIndex = newHistory.findIndex(h => h.surahNumber === ayahToPresent.surahNumber && h.ayahNumber === ayahToPresent.ayahNumber);
                if (existingIndex !== -1) {
                    newHistory.splice(existingIndex, 1);
                }
                newHistory.push(ayahToPresent);
                return newHistory.slice(-4); // Keep only the last 4 distinct ayahs
            });
        } else {
            setMessageKey('messageCouldNotGetAyah');
        }
        setIsLoading(false);
    };

    // Auto-scroll to the new ayah button after an answer is revealed
    useEffect(() => {
        if (correctAnswerRevealed && newAyahButtonRef.current) {
            newAyahButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [correctAnswerRevealed]);


    // Handle user submission of guess
    const handleSubmitGuess = (e) => {
        e.preventDefault();
        if (!currentAyah || !userGuess) {
            return;
        }

        const strippedUserGuess = stripTashkeel(userGuess).toLowerCase().trim();
        const correctSurahNameStripped = currentAyah.surahNameArabicStripped.toLowerCase().trim();
        const correctSurahEnglishName = currentAyah.surahName.toLowerCase().trim();

        // Check if the input is one of the valid surah names or numbers
        const isValidSurahName = surahs.some(s =>
            stripTashkeel(s.arabicName).toLowerCase().trim() === strippedUserGuess ||
            s.name.toLowerCase().trim() === strippedUserGuess ||
            String(s.id) === strippedUserGuess
        );

        if (!isValidSurahName) {
            setIsCorrect(false);
            setMessageKey('messageInvalidSurahName');
            return;
        }

        // Now, check if the valid input is the CORRECT surah
        if (strippedUserGuess === correctSurahNameStripped || strippedUserGuess === correctSurahEnglishName) {
            setIsCorrect(true);
            setMessageKey('messageCorrect');
            setPoints(prevPoints => prevPoints + 1);
            setCorrectAnswerRevealed(true); // User got it right, show solution and get new ayah button
            setQuizActive(false); // End current quiz turn, user got it right
            setHintAyah(null); // Clear hint on correct answer
            // If answered correctly, remove it from wronglyAnsweredAyahs if it was there
            setWronglyAnsweredAyahs(prev => prev.filter(ayah => !(ayah.surahNumber === currentAyah.surahNumber && ayah.ayahNumber === currentAyah.ayahNumber)));
        } else {
            setIsCorrect(false); // For display feedback
            setMessageKey('messageIncorrect'); // Message prompting retry/reveal
            setPoints(prevPoints => Math.max(0, prevPoints - 1)); // Deduct point for incorrect guess
            setCorrectAnswerRevealed(false); // Do NOT reveal answer yet, allow user to retry
            setQuizActive(true); // KEEP quiz active so user can retry
            setHintAyah(null); // Clear hint on incorrect guess
            // Add to wronglyAnsweredAyahs if not already marked for review
            const isAlreadyQueued = wronglyAnsweredAyahs.some(ayah => ayah.surahNumber === currentAyah.surahNumber && ayah.ayahNumber === currentAyah.ayahNumber);
            if (!isAlreadyQueued) {
                 setWronglyAnsweredAyahs(prev => [...prev, currentAyah]);
            }
        }
        setShowOptions(false); // Hide options after guessing
    };

    // Reveal the correct answer without guessing
    const revealAnswer = () => {
        if (!currentAyah) return;
        setIsCorrect(false); // This is a "skip" so it's not "correct", NO point deduction here
        setMessageKey('messageReveal');
        setMessageParams({ surahInfo: language === 'ar' ? `${currentAyah.surahNameArabic} (${currentAyah.surahName})` : `${currentAyah.surahName} (${currentAyah.surahNameArabic})` });
        setCorrectAnswerRevealed(true); // Show solution
        setQuizActive(false); // End current quiz turn
        setShowOptions(false);
        setHintAyah(null); // Clear hint on reveal
        // Add to wronglyAnsweredAyahs if it was not correctly answered before this reveal
        const isAlreadyQueued = wronglyAnsweredAyahs.some(ayah => ayah.surahNumber === currentAyah.surahNumber && ayah.ayahNumber === currentAyah.ayahNumber);
        if (!isAlreadyQueued) {
            setWronglyAnsweredAyahs(prev => [...prev, currentAyah]);
        }
        // Also add to history to count as a presented ayah for other review items
        setHistoryAyahs(prev => {
            const newHistory = [...prev];
            const existingIndex = newHistory.findIndex(h => h.surahNumber === currentAyah.surahNumber && h.ayahNumber === currentAyah.ayahNumber);
            if (existingIndex !== -1) {
                newHistory.splice(existingIndex, 1);
            }
            newHistory.push(currentAyah);
            return newHistory.slice(-4); // Keep only the last 4 distinct ayahs
        });
    };

    // Function to provide a hint (previous or next ayah)
    const getHintAyah = useCallback(() => {
        if (!currentAyah || !quranArabicFull) {
            setMessageKey('messageCouldNotGetAyah');
            return;
        }

        const surahData = quranArabicFull.find(s => s.number === currentAyah.surahNumber);
        if (!surahData) {
            setMessageKey('messageCouldNotGetAyah');
            return;
        }

        const currentAyahIndex = surahData.ayahs.findIndex(a => a.numberInSurah === currentAyah.ayahNumber);

        let hintAyahData = null;
        const isNext = Math.random() < 0.5; // 50% chance for next, 50% for previous

        if (isNext) {
            // Try to get the next ayah
            if (currentAyahIndex < surahData.ayahs.length - 1) {
                hintAyahData = surahData.ayahs[currentAyahIndex + 1];
            } else if (currentAyahIndex > 0) {
                // If no next, try previous as a fallback (for last ayah of surah)
                hintAyahData = surahData.ayahs[currentAyahIndex - 1];
            }
        } else {
            // Try to get the previous ayah
            if (currentAyahIndex > 0) {
                hintAyahData = surahData.ayahs[currentAyahIndex - 1];
            } else if (currentAyahIndex < surahData.ayahs.length - 1) {
                // If no previous, try next as a fallback (for first ayah of surah)
                hintAyahData = surahData.ayahs[currentAyahIndex + 1];
            }
        }

        if (hintAyahData) {
            // Ensure the hint text excludes Basmalah for non-Fatiha first ayahs if it was stripped for the main quiz prompt
            let hintText = hintAyahData.text;
            if (hintAyahData.numberInSurah === 1 && hintAyahData.surah.number !== 1 && hintText.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")) {
                 hintText = hintText.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim();
            }

            setHintAyah({
                text: hintText,
                number: hintAyahData.numberInSurah
            });
        } else {
            setMessageKey('messageCouldNotGetAyah'); // Or a more specific message for no hint available
        }
    }, [currentAyah, quranArabicFull]);

    // Play/Pause audio
    const toggleAudio = () => {
        if (currentAyah && currentAyah.audioUrl) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.src = currentAyah.audioUrl;
                audio.play().catch(e => console.error("Error playing audio:", e));
            }
            setIsPlaying(!isPlaying);
        } else {
            setMessageKey('messageNoAudio');
        }
    };

    // Reset audio state when it ends
    useEffect(() => {
        const handleAudioEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleAudioEnded);
        return () => {
            audio.removeEventListener('ended', handleAudioEnded);
            audio.pause();
            audio.src = '';
        };
    }, [audio]);

    // Handle input change for surah guess
    const handleInputChange = (e) => {
        setUserGuess(e.target.value);
        setShowOptions(true);
        // Do not clear isCorrect and messageKey here, let the submit/reveal logic handle it
    };

    // Handle selection from filtered options
    const handleOptionClick = (surahName) => {
        setUserGuess(surahName);
        setShowOptions(false);
    };

    // Close dropdown if clicked outside the input/options area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (surahInputRef.current && !surahInputRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [surahInputRef]);

    // Function to return to main menu, resetting quiz state
    const returnToMainMenu = () => {
        setQuizStarted(false);
        setAllAyahsInSelection([]);
        setAvailableAyahs([]);
        setWronglyAnsweredAyahs([]);
        setHistoryAyahs([]);
        setCurrentAyah(null);
        setUserGuess('');
        setMessageKey(null);
        setMessageParams(null);
        setIsCorrect(null);
        setCorrectAnswerRevealed(false);
        setQuizActive(false);
        setPoints(0);
        audio.pause();
        setIsPlaying(false);
        setHintAyah(null); // Clear hint on returning to main menu
        setSurahSearchTerm(''); // Clear search term
    };

    const t = translations[language]; // Shorthand for current translations

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center p-4 font-inter text-gray-800 relative pb-28"> {/* Changed pb-40 to pb-28 for more content space */}
            <h1 className="text-5xl lg:text-4xl font-extrabold text-emerald-800 mb-8 drop-shadow-lg text-center font-aref-ruqaa-arabic">
                {t.appTitle}
            </h1>

            {isLoading && (
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-emerald-700">{t.preparing}</p>
                </div>
            )}

            {!quizStarted ? ( // Main Menu: Surah/Juz Selection
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full mb-12 transform transition-all duration-300 hover:scale-[1.01] relative lg:-mt-3"> {/* Added lg:-mt-3 for 12px up */}
                    {/* Language Toggle buttons for Main Menu */}
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-row z-20" dir="ltr">
                        <button
                            onClick={() => setLanguage('ar')}
                            className={`px-3 py-1 rounded-l-lg font-bold transition-colors duration-200 ${language === 'ar' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            AR
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1 rounded-r-lg font-bold transition-colors duration-200 ${language === 'en' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            EN
                        </button>
                    </div>

                    <h2 className="text-3xl lg:text-2xl font-semibold text-teal-700 mb-6 text-center mt-12 md:mt-0"> {/* Adjusted margin-top to account for absolute language toggle */}
                        {t.chooseSurahs}
                    </h2>

                    <div className="flex flex-col md:flex-row justify-around gap-6 mb-8">
                        {/* Juz Selection */}
                        <div className="flex-1 border border-emerald-200 rounded-xl p-4 bg-emerald-50">
                            <h3 className="text-xl font-medium text-emerald-900 mb-4">{t.selectJuzs}</h3>
                            {/* Placeholder to align with the search bar in the Surah section */}
                            <div className="h-12 mb-4 flex items-center justify-center"> {/* Adjusted height to align with input + margin */}
                                {/* Empty div for spacing */}
                            </div>
                            <div className="max-h-60 overflow-y-auto" style={{ direction: language === 'ar' ? 'ltr' : 'rtl' }}>
                                <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }} className="px-2">
                                    {[...Array(30)].map((_, i) => (
                                        <div key={i + 1} className="flex items-center mb-2 gap-x-3">
                                            <input
                                                type="checkbox"
                                                id={`juz-${i + 1}`}
                                                checked={selectedJuzs.includes(i + 1)}
                                                onChange={(e) => handleJuzSelect(i + 1, e.target.checked)}
                                                className="form-checkbox h-5 w-5 text-emerald-600 rounded-md focus:ring-emerald-500 cursor-pointer"
                                            />
                                            <label htmlFor={`juz-${i + 1}`} className="text-lg text-gray-700 cursor-pointer">
                                                {t.juzs[i + 1]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Surah Selection */}
                        <div className="flex-1 border border-emerald-200 rounded-xl p-4 bg-emerald-50">
                            <h3 className="text-xl font-medium text-emerald-900 mb-4">{t.selectSurahs}</h3>
                            {/* Search Bar for Surahs */}
                            <input
                                type="text"
                                placeholder={language === 'ar' ? "ابحث عن السورة" : "Search Surah..."}
                                value={surahSearchTerm}
                                onChange={(e) => setSurahSearchTerm(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                dir={language === 'ar' ? 'rtl' : 'ltr'}
                            />
                            <div className="max-h-60 overflow-y-auto" style={{ direction: language === 'ar' ? 'ltr' : 'rtl' }}>
                                <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }} className="px-2">
                                    {filteredSurahsForSearch.map(surah => (
                                        <div key={surah.id} className="flex items-center mb-2 gap-x-3">
                                            <input
                                                type="checkbox"
                                                id={`surah-${surah.id}`}
                                                checked={selectedSurahs.includes(surah.id)}
                                                onChange={(e) => handleSurahSelect(surah.id, e.target.checked)}
                                                className="form-checkbox h-5 w-5 text-emerald-600 rounded-md focus:ring-emerald-500 cursor-pointer"
                                            />
                                            <label htmlFor={`surah-${surah.id}`} className="text-lg text-gray-700 cursor-pointer">
                                                {language === 'ar' ? (
                                                    <><span dir="rtl">{surah.arabicName}</span> ({surah.name})</>
                                                ) : (
                                                    <>{surah.id}. {surah.name} ({surah.arabicName})</>
                                                )}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={prepareAyahs}
                        disabled={isLoading || (selectedSurahs.length === 0 && selectedJuzs.length === 0)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t.preparing : t.prepareAyahsButton}
                    </button>

                    {displayMessage && !quizStarted && (
                        <p className={`text-center text-lg font-semibold mt-4 p-3 rounded-lg ${messageColorClass}`}>
                            {displayMessage}
                        </p>
                    )}
                </div>
            ) : ( // Quiz Area
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full transform transition-all duration-300 hover:scale-[1.01] relative">
                    {/* Header bar for Quiz Area with Language Toggle, Return button, and Points */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
                        {/* Language Toggle buttons for Quiz Area */}
                        <div className="flex flex-row z-20 mb-4 md:mb-0" dir="ltr">
                            <button
                                onClick={() => setLanguage('ar')}
                                className={`px-3 py-1 rounded-l-lg font-bold transition-colors duration-200 ${language === 'ar' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                AR
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 rounded-r-lg font-bold transition-colors duration-200 ${language === 'en' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Points Display */}
                        <div className="order-first md:order-none text-xl font-bold text-emerald-700 px-4 py-2 bg-emerald-100 rounded-lg shadow-sm mb-4 md:mb-0">
                            {t.pointsLabel}: {points}
                        </div>

                        {/* Return to Main Menu button */}
                        <div style={{ direction: 'ltr' }}>
                            <button
                                onClick={returnToMainMenu}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                            >
                                {t.returnToMainMenuButton}
                            </button>
                        </div>
                    </div>

                    {!currentAyah && (
                        <button
                            onClick={startNewQuizRound}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                                        disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                        >
                            {t.startQuizButton}
                        </button>
                    )}

                    {currentAyah && (
                        <div className="text-center mb-6 border-b pb-6 border-emerald-200">
                            <p className="text-4xl arabic-font mb-4 text-emerald-900 leading-relaxed" dir="rtl">
                                {currentAyah.quizPromptArabicText}
                            </p>
                            <p className="text-xl text-gray-600 mb-2 italic">
                                Transliteration: {currentAyah.transliteration}
                            </p>
                            <p className="text-xl text-gray-700 mb-4" dir="ltr">
                                Translation: {currentAyah.englishTranslation.trim()}
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={toggleAudio}
                                    disabled={!currentAyah.audioUrl || isLoading}
                                    className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md
                                                ${isPlaying ? 'bg-purple-800' : ''} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                                >
                                    {isPlaying ? (
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {t.pauseButton}
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {t.listenButton}
                                        </span>
                                    )}
                                </button>
                                {/* Hint Button */}
                                <button
                                    onClick={getHintAyah}
                                    disabled={!currentAyah || isLoading || correctAnswerRevealed || hintAyah !== null} // Disable if hint already shown
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md
                                            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t.hintButton}
                                </button>
                            </div>

                            {hintAyah && (
                                <p className="text-xl arabic-font text-emerald-700 mt-4 p-2 bg-emerald-50 rounded-lg" dir="rtl">
                                    <span className="font-bold">({language === 'ar' ? 'تلميح' : 'Hint'}) آية {language === 'ar' ? convertToArabicNumbers(hintAyah.number) : hintAyah.number}:</span> {hintAyah.text}
                                </p>
                            )}
                        </div>
                    )}

                    {currentAyah && quizActive && ( // Only show guess input and buttons when quiz is active (awaiting a valid answer or reveal)
                        <form onSubmit={handleSubmitGuess} className="mb-4">
                            <div className="relative" ref={surahInputRef}>
                                <input
                                    type="text"
                                    value={userGuess}
                                    onChange={handleInputChange}
                                    placeholder={t.enterSurahPlaceholder}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    onFocus={() => setShowOptions(true)}
                                    disabled={!quizActive}
                                    dir={language === 'ar' ? 'rtl' : 'ltr'} // Set direction based on language
                                />
                                {showOptions && filteredSurahGuesses.length > 0 && userGuess && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto mt-1 shadow-lg"
                                        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                                        {filteredSurahGuesses.map(surah => (
                                            <li
                                                key={surah.id}
                                                className="p-3 hover:bg-emerald-100 cursor-pointer border-b last:border-b-0 text-gray-800"
                                                onClick={() => handleOptionClick(language === 'ar' ? surah.arabicName : surah.name)} // Set guess based on language
                                                dir={language === 'ar' ? 'rtl' : 'ltr'} // Set direction for list items
                                            >
                                                {language === 'ar' ? (
                                                    <><span dir="rtl">{surah.arabicName}</span> ({surah.name})</>
                                                ) : (
                                                    <>{surah.id}. {surah.name} (<span dir="rtl">{surah.arabicName}</span>)</>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className={`flex gap-4 mt-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <button
                                    type="submit"
                                    disabled={isLoading || !userGuess || !quizActive}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.submitGuessButton}
                                </button>
                                <button
                                    type="button"
                                    onClick={revealAnswer}
                                    disabled={isLoading || !currentAyah || !quizActive}
                                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.revealAnswerButton}
                                </button>
                            </div>
                        </form>
                    )}

                    {displayMessage && quizStarted && (
                        <p className={`text-center text-lg font-semibold mb-4 ${messageColorClass}`}>
                            {displayMessage}
                        </p>
                    )}

                    {correctAnswerRevealed && currentAyah && (
                        <div className="text-center mt-4 p-4 border border-emerald-300 rounded-xl bg-emerald-50">
                            <p className="text-xl font-semibold text-emerald-800 mb-2">
                                {language === 'ar' ? (
                                    <>
                                        <span className="arabic-font" dir="rtl">{currentAyah.surahNameArabic}</span> ({currentAyah.surahName})
                                        <>, {t.ayahLabel} {convertToArabicNumbers(currentAyah.ayahNumber)}</>
                                        {currentAyah.juzNumber && (
                                            <>, {t.juzLabel} {convertToArabicNumbers(currentAyah.juzNumber)}</>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {currentAyah.surahName} (<span className="arabic-font" dir="rtl">{currentAyah.surahNameArabic}</span>)
                                        <>, {t.ayahLabel} {currentAyah.ayahNumber}</>
                                        {currentAyah.juzNumber && (
                                            <>, {t.juzLabel} {currentAyah.juzNumber}</>
                                        )}
                                    </>
                                )}
                            </p>
                            <a
                                href={`${QURAN_DOT_COM_BASE_URL}/${currentAyah.surahNumber}/${currentAyah.ayahNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                {t.viewOnQuranCom}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                            </a>
                        </div>
                    )}

                    {correctAnswerRevealed && ( // Show Get New Ayah button after answer is known
                        <div className="flex justify-center mt-6" ref={newAyahButtonRef}>
                            <button
                                onClick={startNewQuizRound}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.getNewAyahButton}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Donation Area - Always Visible */}
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-emerald-50 bg-opacity-95 rounded-t-3xl shadow-2xl flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-x-4 gap-y-1 z-50 text-center">
                <a
                    href={KO_FI_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-800 text-lg font-semibold flex items-center justify-center gap-x-2 hover:underline hover:text-emerald-900"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{t.supportWork}</span>
                    <span
                        className="text-emerald-800 text-2xl" // Removed hover scale here, as the whole link already has hover underline.
                        title="Buy me a coffee on Ko-fi!"
                    >
                        ☕
                    </span>
                </a>
                <p className="text-gray-600 text-sm mt-1 sm:mt-0"> {/* Adjusted margin-top for small screens, removed for larger */}
                    {t.copyrightInfo}
                </p>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Lateef:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap'); /* Added Aref Ruqaa font */

                body {
                    font-family: 'Inter', sans-serif;
                }
                .arabic-font {
                    font-family: 'Lateef', serif;
                }
                .font-aref-ruqaa-arabic { /* New class for the website title */
                    font-family: 'Aref Ruqaa', serif;
                }
            `}</style>
        </div>
    );
};

export default App;
