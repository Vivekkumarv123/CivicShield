export const CONTENT = {
  en: {
    hero: {
      title: "Empowering Every Vote with Intelligence",
      subtitle: "Your trusted AI-powered companion for navigating the Indian Election process. Secure, Multilingual, and Fact-Checked.",
      cta: "Start Your Journey",
      chatCta: "Ask AI Assistant",
    },
    journey: {
      title: "Election Journey",
      timeline: [
        { title: "Voter Registration", description: "Ensure you are on the electoral roll. Apply via Form 6 if you are a first-time voter." },
        { title: "Know Your Candidate", description: "Check the background, education, and assets of candidates in your constituency." },
        { title: "Identify Polling Booth", description: "Find your designated voting location using your EPIC number." },
        { title: "The Voting Day", description: "Carry your Voter ID or approved alternate ID. Verify your name and cast your vote." },
        { title: "Verify with VVPAT", description: "See the printed slip in the VVPAT machine to confirm your vote was recorded correctly." },
      ],
      registration: [
        { step: 1, title: "Check Eligibility", content: "You must be an Indian citizen and 18 years or older on the qualifying date." },
        { step: 2, title: "Fill Form 6", content: "Visit voters.eci.gov.in or use the Voter Helpline App to fill Form 6." },
        { step: 3, title: "Upload Documents", content: "Keep your photograph, age proof, and residence proof ready for upload." },
        { step: 4, title: "Field Verification", content: "A Booth Level Officer (BLO) will visit you for physical verification." },
      ],
      flashcards: [
        { term: "EVM", definition: "Electronic Voting Machine used for recording votes." },
        { term: "VVPAT", definition: "Voter Verifiable Paper Audit Trail for physical verification of the vote." },
        { term: "NOTA", definition: "None of the Above option if you don't wish to vote for any candidate." },
        { term: "Model Code of Conduct", definition: "Guidelines for political parties and candidates during elections." },
      ],
    },
    mythVsFact: {
      title: "Myth vs Fact",
      items: [
        { myth: "You can vote online in Indian General Elections.", fact: "False. You must physically visit your designated polling booth to vote." },
        { myth: "If you have a Voter ID, you can vote even if your name isn't in the list.", fact: "False. Your name MUST be in the electoral roll to cast a vote." },
        { myth: "Voting twice is allowed if you have property in two cities.", fact: "False. Voting in more than one place is a punishable offense." },
      ],
    },
    readiness: {
      title: "Election Readiness Score",
      checklist: [
        "I have a valid Voter ID (EPIC)",
        "My name is in the latest Electoral Roll",
        "I know my Polling Booth location",
        "I have researched the candidates",
        "I understand how to use an EVM/VVPAT",
      ],
      result: "You are {score}% ready for the election!",
    },
    common: {
      language: "Language",
      back: "Back",
      next: "Next",
    }
  },
  hi: {
    hero: {
      title: "बुद्धिमत्ता के साथ हर वोट को सशक्त बनाना",
      subtitle: "भारतीय चुनाव प्रक्रिया को समझने के लिए आपका विश्वसनीय AI-आधारित साथी। सुरक्षित, बहुभाषी और तथ्य-जांच के साथ।",
      cta: "अपनी यात्रा शुरू करें",
      chatCta: "AI सहायक से पूछें",
    },
    journey: {
      title: "चुनावी यात्रा",
      timeline: [
        { title: "मतदाता पंजीकरण", description: "सुनिश्चित करें कि आपका नाम मतदाता सूची में है। पहली बार मतदाता बनने पर फॉर्म 6 भरें।" },
        { title: "अपने उम्मीदवार को जानें", description: "अपने निर्वाचन क्षेत्र के उम्मीदवारों की पृष्ठभूमि, शिक्षा और संपत्ति की जांच करें।" },
        { title: "मतदान केंद्र की पहचान", description: "अपने ईपीआईसी (EPIC) नंबर का उपयोग करके अपने निर्धारित मतदान केंद्र का पता लगाएं।" },
        { title: "मतदान का दिन", description: "अपना वोटर आईडी या अनुमोदित वैकल्पिक आईडी साथ रखें। अपना नाम सत्यापित करें और वोट डालें।" },
        { title: "VVPAT के साथ सत्यापन", description: "वोट सही ढंग से दर्ज हुआ है, यह सुनिश्चित करने के लिए VVPAT मशीन में छपी पर्ची देखें।" },
      ],
      registration: [
        { step: 1, title: "पात्रता की जांच करें", content: "निर्धारित तिथि पर आपकी आयु 18 वर्ष या उससे अधिक होनी चाहिए और आप भारतीय नागरिक होने चाहिए।" },
        { step: 2, title: "फॉर्म 6 भरें", content: "voters.eci.gov.in पर जाएं या फॉर्म 6 भरने के लिए वोटर हेल्पलाइन ऐप का उपयोग करें।" },
        { step: 3, title: "दस्तावेज़ अपलोड करें", content: "अपलोड के लिए अपनी फोटो, आयु प्रमाण और निवास प्रमाण तैयार रखें।" },
        { step: 4, title: "क्षेत्र सत्यापन", content: "भौतिक सत्यापन के लिए एक बूथ स्तर का अधिकारी (BLO) आपके पास आएगा।" },
      ],
      flashcards: [
        { term: "EVM", definition: "वोट रिकॉर्ड करने के लिए उपयोग की जाने वाली इलेक्ट्रॉनिक वोटिंग मशीन।" },
        { term: "VVPAT", definition: "वोट के भौतिक सत्यापन के लिए वोटर वेरिफ़िएबल पेपर ऑडिट ट्रेल।" },
        { term: "NOTA", definition: "उपरोक्त में से कोई नहीं विकल्प, यदि आप किसी भी उम्मीदवार को वोट नहीं देना चाहते हैं।" },
        { term: "आदर्श आचार संहिता", definition: "चुनाव के दौरान राजनीतिक दलों और उम्मीदवारों के लिए दिशानिर्देश।" },
      ],
    },
    mythVsFact: {
      title: "मिथक बनाम तथ्य",
      items: [
        { myth: "आप भारतीय आम चुनाव में ऑनलाइन वोट दे सकते हैं।", fact: "गलत। वोट डालने के लिए आपको अपने निर्धारित मतदान केंद्र पर जाना होगा।" },
        { myth: "यदि आपके पास वोटर आईडी है, तो आप सूची में नाम न होने पर भी वोट दे सकते हैं।", fact: "गलत। वोट डालने के लिए आपका नाम मतदाता सूची में होना अनिवार्य है।" },
        { myth: "यदि आपके पास दो शहरों में संपत्ति है तो दो बार मतदान करने की अनुमति है।", fact: "गलत। एक से अधिक स्थान पर मतदान करना दंडनीय अपराध है।" },
      ],
    },
    readiness: {
      title: "चुनावी तैयारी स्कोर",
      checklist: [
        "मेरे पास वैध वोटर आईडी (EPIC) है",
        "मेरा नाम नवीनतम मतदाता सूची में है",
        "मुझे अपने मतदान केंद्र की स्थिति पता है",
        "मैंने उम्मीदवारों के बारे में शोध किया है",
        "मैं समझता हूँ कि EVM/VVPAT का उपयोग कैसे करें",
      ],
      result: "आप चुनाव के लिए {score}% तैयार हैं!",
    },
    common: {
      language: "भाषा",
      back: "पीछे",
      next: "अगला",
    }
  },
  mr: {
    hero: {
      title: "प्रत्येक मताला बुद्धिमत्तेने सक्षम करणे",
      subtitle: "भारतीय निवडणूक प्रक्रिया समजून घेण्यासाठी तुमचा विश्वासार्ह AI-आधारित सोबती. सुरक्षित, बहुभाषिक आणि तथ्य-तपासणीसह.",
      cta: "तुमचा प्रवास सुरू करा",
      chatCta: "AI सहाय्यकाला विचारा",
    },
    journey: {
      title: "निवडणूक प्रवास",
      timeline: [
        { title: "मतदार नोंदणी", description: "तुमचे नाव मतदार यादीत असल्याची खात्री करा. पहिल्यांदा मतदान करणार असाल तर फॉर्म ६ भरा." },
        { title: "तुमच्या उमेदवाराला ओळखा", description: "तुमच्या मतदारसंघातील उमेदवारांची पार्श्वभूमी, शिक्षण आणि मालमत्ता तपासा." },
        { title: "मतदान केंद्राची ओळख", description: "तुमचा EPIC नंबर वापरून तुमचे नियुक्त मतदान केंद्र शोधा." },
        { title: "मतदानाचा दिवस", description: "तुमचे मतदार ओळखपत्र किंवा मंजूर पर्यायी ओळखपत्र सोबत ठेवा. तुमचे नाव तपासा आणि मतदान करा." },
        { title: "VVPAT सह पडताळणी", description: "तुमचे मत योग्यरित्या नोंदवले गेल्याची खात्री करण्यासाठी VVPAT मशीनमधील छापील पावती पहा." },
      ],
      registration: [
        { step: 1, title: "पात्रता तपासा", content: "तुमचे वय १८ वर्षे किंवा त्याहून अधिक असावे आणि तुम्ही भारतीय नागरिक असावे." },
        { step: 2, title: "फॉर्म ६ भरा", content: "voters.eci.gov.in ला भेट द्या किंवा फॉर्म ६ भरण्यासाठी 'व्होटर हेल्पलाइन' ॲप वापरा." },
        { step: 3, title: "कागदपत्रे अपलोड करा", content: "तुमचा फोटो, वयाचा पुरावा आणि निवासाचा पुरावा अपलोड करण्यासाठी तयार ठेवा." },
        { step: 4, title: "क्षेत्र पडताळणी", content: "भौतिक पडताळणीसाठी बूथ लेव्हल ऑफिसर (BLO) तुमच्याकडे येईल." },
      ],
      flashcards: [
        { term: "EVM", definition: "मते नोंदवण्यासाठी वापरले जाणारे इलेक्ट्रॉनिक मतदान यंत्र." },
        { term: "VVPAT", definition: "मताच्या भौतिक पडताळणीसाठी 'व्होटर व्हेरिफिएबल पेपर ऑडिट ट्रेल'." },
        { term: "NOTA", definition: "जर तुम्हाला कोणत्याही उमेदवाराला मत द्यायचे नसेल तर 'वरीलपैकी कोणीही नाही' हा पर्याय." },
        { term: "आदर्श आचारसंहिता", definition: "निवडणुकीदरम्यान राजकीय पक्ष आणि उमेदवारांसाठी मार्गदर्शक तत्त्वे." },
      ],
    },
    mythVsFact: {
      title: "भ्रम विरुद्ध वास्तव",
      items: [
        { myth: "तुम्ही भारतीय सार्वत्रिक निवडणुकीत ऑनलाइन मतदान करू शकता.", fact: "चूक. मतदान करण्यासाठी तुम्हाला तुमच्या नियुक्त मतदान केंद्राला प्रत्यक्ष भेट द्यावी लागेल." },
        { myth: "तुमच्याकडे मतदार ओळखपत्र असल्यास, तुमचे नाव यादीत नसले तरीही तुम्ही मतदान करू शकता.", fact: "चूक. मतदान करण्यासाठी तुमचे नाव मतदार यादीत असणे आवश्यक आहे." },
        { myth: "तुमची दोन शहरांमध्ये मालमत्ता असल्यास दोनदा मतदान करण्याची परवानगी आहे.", fact: "चूक. एकापेक्षा जास्त ठिकाणी मतदान करणे हा गुन्हा आहे." },
      ],
    },
    readiness: {
      title: "निवडणूक तयारी धावसंख्या",
      checklist: [
        "माझ्याकडे वैध मतदार ओळखपत्र (EPIC) आहे",
        "माझे नाव नवीनतम मतदार यादीत आहे",
        "मला माझ्या मतदान केंद्राचे ठिकाण माहित आहे",
        "मी उमेदवारांबद्दल संशोधन केले आहे",
        "EVM/VVPAT कसे वापरायचे हे मला समजते",
      ],
      result: "तुम्ही निवडणुकीसाठी {score}% तयार आहात!",
    },
    common: {
      language: "भाषा",
      back: "मागे",
      next: "पुढील",
    }
  }
};

export type Locale = keyof typeof CONTENT;
