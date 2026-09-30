/* =====================================================================
   BreatheWell AI — client-side knowledge engine
   Intent matching, safety guardrails, symptom text analysis and
   action-plan generation. Runs fully in the browser; no data leaves
   the device.
   ===================================================================== */

export function normalize(text) {
  return (
    ' ' +
    (text || '')
      .toLowerCase()
      .replace(/['’]/g, '') // can't -> cant
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() +
    ' '
  )
}

/* ------------------------------------------------------------------ */
/* Emergency detection — checked before anything else                 */
/* ------------------------------------------------------------------ */
const EMERGENCY_RE = new RegExp(
  [
    'cant breathe', 'cannot breathe', 'can not breathe', 'not breathing', 'stopped breathing',
    'barely breathe', 'hard to breathe (right|so|very|really)? ?(now)?', 'gasping', 'choking',
    'blue lips', 'lips (are )?(turning )?(blue|grey|gray)', 'blue (finger)?nail', 'blue tongue',
    'unconscious', 'passed out', 'collaps', 'worst (attack|asthma)', 'severe(ly)? (attack|breathless)',
    'having (an|a) (asthma )?attack (right )?now', 'call (an )?ambulance', 'emergency', 'dying',
    'scared i (might|will) die', 'cant (talk|speak)', 'unable to (talk|speak)',
  ].join('|'),
  'i'
)

export function detectEmergency(text) {
  return EMERGENCY_RE.test(normalize(text))
}

export const EMERGENCY_RESPONSE = {
  role: 'assistant',
  emergency: true,
  text: `**This sounds like it could be an asthma emergency.**\n\nPlease act now:\n• Sit upright — do NOT lie down. Stay as calm as you can.\n• Take your reliever (blue) inhaler: 1 puff every 30–60 seconds, up to 10 puffs.\n• If there is no improvement — or it is getting worse — **call an ambulance immediately** (India: 108 / 102 · US: 911).\n• Do not drive yourself to hospital. Unlock the door and sit near it while you wait.\n\nIf this is happening right now, stop chatting and get help. I am an AI assistant — not a substitute for emergency care.`,
  chips: ['Asthma attack first aid', 'Warning signs of an attack', 'Green, yellow, red zones'],
}

/* ------------------------------------------------------------------ */
/* Knowledge base                                                     */
/* ------------------------------------------------------------------ */
const KB = [
  {
    id: 'greeting',
    patterns: [/\b(hi|hii+|hello|hey|namaste|namaskar|good (morning|afternoon|evening|day))\b/, /^(yo|hola)\b/],
    response: `Hello! I'm **BreatheWell AI**, your asthma education assistant. 😊\n\nI can answer questions about symptoms, triggers, inhalers, action plans, and living well with asthma — 24/7, right from your browser.\n\nWhat would you like to know?`,
    chips: ['What is asthma?', 'Reliever vs preventer', 'What are common triggers?'],
  },
  {
    id: 'thanks',
    patterns: [/\b(thank(s| you)?|shukriya|dhanyavad)\b/],
    response: `You're very welcome! 💙 Taking charge of your asthma education is one of the best things you can do for your lungs.\n\nIs there anything else you'd like to understand better?`,
    chips: ['Asthma attack first aid', 'Control self-check', 'Inhaler technique'],
  },
  {
    id: 'bye',
    patterns: [/\b(bye|goodbye|see you|good night)\b/],
    response: `Take care, and breathe easy! 🌿 Remember: keep your reliever inhaler within reach and follow your action plan. I'm here whenever you need me.`,
    chips: [],
  },
  {
    id: 'identity',
    patterns: [/\b(who are you|what are you|are you (a |an )?(real |human |doctor|ai|robot|bot)|your name|real doctor)\b/],
    response: `I'm **BreatheWell AI** — an education assistant built into this website. I'm not a doctor, and I can't diagnose or prescribe.\n\nMy job is to explain asthma in clear language using guidance consistent with international bodies like WHO and GINA, and to help you know **when and why** to see your doctor.\n\nEverything I say is for education only — always confirm important decisions with a qualified physician.`,
    chips: ['What is asthma?', 'When should I see a doctor?', 'Is asthma curable?'],
  },
  {
    id: 'what_is',
    patterns: [/\b(what|whats|define|meaning|explain)\b.*\basthma/, /\basthma (kya|hoti) (hai|he)\b/, /\babout asthma\b/, /^(asthma)$/],
    response: `**Asthma** is a long-term condition affecting the airways — the tubes carrying air in and out of your lungs.\n\nIn asthma, the airways are:\n• **Inflamed** — the lining is swollen and produces extra mucus\n• **Over-sensitive** — they react strongly to triggers like dust, smoke or cold air\n• **Prone to tightening** — muscles around them squeeze (bronchospasm), narrowing the passage\n\nThis causes wheezing, coughing, chest tightness and breathlessness that come and go. Asthma is **not contagious** and is very manageable with the right treatment.`,
    chips: ['Common symptoms', 'What causes asthma?', 'Is asthma curable?'],
  },
  {
    id: 'causes',
    patterns: [/\b(cause|causes|reason|why (do|did|does)|get asthma|develop asthma|genetic|hereditary|runs in famil(y|ies))\b/],
    response: `Asthma develops from a **mix of genes and environment**:\n\n• **Genetics** — it often runs in families, especially alongside eczema and hay fever (the "atopic" tendency)\n• **Allergen exposure** — dust mites, pollen, mould, pet dander\n• **Air pollution & tobacco smoke** — including exposure in childhood\n• **Respiratory infections** in early life\n• **Occupational exposures** — flour dust, chemicals, fumes\n• Other contributors: obesity, acid reflux, certain painkillers (like aspirin in some people)\n\nHaving a risk factor doesn't guarantee asthma — and asthma can appear at any age, even in adults who never had it as children.`,
    chips: ['What are common triggers?', 'Occupational asthma', 'Types of asthma'],
  },
  {
    id: 'symptoms',
    patterns: [/\bsymptom/, /\b(sign|signs) of asthma\b/, /\bhow (do i|to) know (if)?\s*(i have|its) asthma\b/, /\bwheez/],
    response: `The **classic asthma symptoms** are:\n\n• **Wheezing** — a whistling sound when breathing, especially out\n• **Shortness of breath** — feeling you can't get enough air\n• **Chest tightness** — like a band squeezing your chest\n• **Coughing** — often dry, worse at night or early morning\n\n**Patterns that point to asthma:** symptoms that vary day to day, worse at night/early morning, and triggered by exercise, dust, cold air or smoke.\n\n⚠️ Only a doctor can diagnose asthma — usually with a breathing test called **spirometry**. If these symptoms sound familiar, it's worth booking a check-up.`,
    chips: ['How is asthma diagnosed?', 'Night-time symptoms', 'Control self-check'],
  },
  {
    id: 'diagnosis',
    patterns: [/\b(diagnos|spirometr|peak flow test|fev|lung test|breathing test|confirm asthma)\b/],
    response: `Asthma is usually diagnosed by a doctor using:\n\n• **History** — your symptom pattern, triggers, family history\n• **Spirometry** — the gold-standard breathing test; measures how much and how fast you can blow out (FEV1)\n• **Bronchodilator reversibility** — spirometry repeated after a reliever puff to see if airflow improves\n• **Peak flow monitoring** — home readings over 2+ weeks\n• Sometimes: allergy tests, FeNO (exhaled nitric oxide), chest X-ray to rule out other causes\n\nIf you suspect asthma, ask your doctor about **spirometry with reversibility testing** — it's quick, painless and non-invasive.`,
    chips: ['What is peak flow?', 'Common symptoms', 'Is asthma curable?'],
  },
  {
    id: 'triggers',
    patterns: [/\btrigger/, /\bwhat (makes|worsens|aggravates)\b.*\b(asthma|worse)\b/, /\ballergen/],
    response: `**Triggers** irritate sensitive airways and set off symptoms. The most common:\n\n• Dust mites, mould, cockroaches\n• Pollen (seasonal)\n• Pet dander (cat, dog, bird)\n• Tobacco smoke & air pollution\n• Cold or dry air, sudden weather changes\n• Respiratory infections — colds & flu\n• Exercise (especially in cold air)\n• Strong smells — perfume, incense, agarbatti, cleaning sprays\n• Stress, anxiety, hard laughing or crying\n• Some medicines: aspirin, NSAIDs, beta-blockers (in sensitive people)\n• Acid reflux (GERD)\n\n💡 **Tip:** keep a 2-week symptom diary to find YOUR personal triggers — it often reveals surprising patterns.`,
    chips: ['Dust mite tips', 'Cold weather tips', 'Smoking and asthma'],
  },
  {
    id: 'dust',
    patterns: [/\bdust\b/, /\bdust mite/, /\bbedding\b/, /\bhouse clean/],
    response: `**Dust mites** are the #1 indoor asthma trigger — microscopic creatures living in bedding, carpets and soft furnishings.\n\n**Practical steps:**\n• Wash bedding weekly in hot water (60°C)\n• Use allergen-proof covers on mattress and pillows\n• Vacuum with a HEPA filter; damp-dust instead of dry dusting\n• Keep bedroom humidity below 50%\n• Minimise carpets, heavy curtains and soft toys in the bedroom\n• Sun-dry pillows and mattresses regularly\n\nSmall changes in the bedroom often give the biggest improvement, since you spend 7–8 hours there nightly.`,
    chips: ['Night-time symptoms', 'Other common triggers', 'Living well tips'],
  },
  {
    id: 'pollution',
    patterns: [/\bpollut/, /\baqi\b/, /\bsmog\b/, /\btraffic\b/, /\bmask\b/],
    response: `**Air pollution** is a major asthma trigger — both outdoor (vehicle exhaust, smog, crop burning) and indoor (biomass/chulha smoke, incense).\n\n**Protect yourself:**\n• Check the **AQI** before outdoor exercise; stay indoors on "poor" or worse days\n• Keep windows closed during high-pollution hours; ventilate when AQI improves\n• A well-fitted **N95** mask filters fine particles during unavoidable exposure\n• Avoid burning incense/agarbatti in closed rooms\n• Never allow smoking indoors\n• Consider an air purifier with a HEPA filter for the bedroom\n\nOn high-AQI days, switch exercise indoors rather than skipping it entirely.`,
    chips: ['Cold weather tips', 'Smoking and asthma', 'Exercise with asthma'],
  },
  {
    id: 'smoking',
    patterns: [/\bsmok/, /\btobacco\b/, /\bcigarette/, /\bbidi/, /\bvap(e|ing)\b/, /\bhookah\b/],
    response: `**Tobacco smoke and asthma are a dangerous combination:**\n\n• Smoking damages airways and makes inhalers work less effectively\n• Second-hand smoke triggers attacks — especially in children\n• Children of smokers have more wheezing, more hospital visits\n• Vaping and hookah are **not** safe alternatives — they still irritate airways\n\n**Quitting is the single best gift for asthmatic lungs.** Within weeks, airways start to heal. Ask your doctor about cessation support — nicotine replacement, counselling, and quitlines (India: 1800-11-2356).\n\nIf you don't smoke but live with a smoker: strict no-smoking-indoors rule, no exceptions.`,
    chips: ['Other common triggers', 'Asthma in children', 'Living well tips'],
  },
  {
    id: 'weather',
    patterns: [/\b(cold|winter|monsoon|rain|humid|weather|season|summer|temperature)\b/],
    response: `**Weather affects asthma** in several ways:\n\n• **Cold, dry air** — dries and tightens airways. Cover nose & mouth with a scarf; breathe through your nose to warm the air\n• **Winter** — more viruses circulating; keep vaccinations current\n• **Monsoon/humidity** — mould and dust mites thrive; use a dehumidifier if possible and fix damp walls\n• **Thunderstorms** — can burst pollen grains and cause attack clusters ("thunderstorm asthma")\n• **Summer heat** — ozone levels rise on hot days\n\nTrack how YOUR asthma responds to seasons in a diary, and discuss seasonal dose adjustments with your doctor — many patients need a preventive step-up before their difficult season.`,
    chips: ['Pollution and asthma', 'Common triggers', 'Vaccines and asthma'],
  },
  {
    id: 'reliever',
    patterns: [/\breliever\b/, /\brescue (inhaler|puffer|inhaler)/, /\bblue inhaler\b/, /\bsalbutamol\b/, /\balbuterol\b/, /\basthalin\b/, /\bventolin\b/, /\bquick relief\b/],
    response: `**Reliever inhalers** (usually the blue one) are fast-acting bronchodilators like **salbutamol/albuterol**.\n\n**Key facts:**\n• They relax tightened airway muscles within **5–15 minutes**\n• Use for sudden symptoms or before exercise (if advised)\n• **Always carry it** — at school, work, gym, travel\n• Relief lasts about 4–6 hours\n\n🚩 **Important warning:** needing your reliever **more than twice a week** (outside exercise) means your asthma is NOT well controlled. Over-reliance on relievers is linked to higher attack risk. See your doctor — you likely need a daily controller, not just more blue puffs.`,
    chips: ['Preventer inhalers explained', 'Inhaler technique', 'Control self-check'],
  },
  {
    id: 'controller',
    patterns: [/\b(controller|preventer|preventive|maintenance|daily) (inhaler|medicine|medication|pump)/, /\binhaled (corticosteroid|steroid)/, /\bics\b/, /\bbudesonide\b/, /\bfluticasone\b/, /\bbeclom/, /\bsymbicort\b/, /\bseroflo\b/, /\bsteroid\b/],
    response: `**Controller (preventer) inhalers** contain low-dose inhaled corticosteroids (ICS) — alone or combined with long-acting bronchodilators.\n\n**How they work:** they calm the underlying airway **inflammation** over days to weeks — preventing symptoms and attacks rather than just treating them.\n\n**Golden rules:**\n• Take them **every day**, even when you feel perfectly fine\n• They're not addictive, and inhaled doses are far smaller and safer than steroid tablets\n• **Rinse your mouth** after each use to prevent oral thrush and hoarseness\n• Don't expect instant relief — that's the reliever's job\n\nCommon examples: budesonide, fluticasone, beclometasone, often paired with formoterol or salmeterol.`,
    chips: ['Are steroid inhalers safe?', 'Reliever vs preventer', 'Inhaler technique'],
  },
  {
    id: 'steroid_myth',
    patterns: [/\bsteroid.*(safe|dangerous|harmful|addictive|side effect)/, /\b(addictive|addicted|habit.forming)/, /\bside effects? of (inhaler|steroid|asthma medicine)/],
    response: `**This is one of the most harmful asthma myths.** Let me clear it up:\n\n• Inhaled corticosteroids are **NOT** the anabolic steroids used for bodybuilding\n• They are **NOT addictive** — your body doesn't crave them, and you can be stepped down once control is achieved\n• The dose reaching your body is **tiny** (micrograms) because medicine goes straight to the lungs\n• Decades of use show they're safe at prescribed doses — in children too\n• Stopping them "because you feel fine" is the most common reason for preventable attacks\n\n**The real danger is untreated inflammation.** Poorly controlled asthma damages airways permanently over time. Never stop or reduce a controller without your doctor's guidance.`,
    chips: ['Controller inhalers explained', 'When can I stop my inhaler?', 'Inhaler technique'],
  },
  {
    id: 'stop_med',
    patterns: [/\b(stop|stopping|quit|discontinue|leave).*(inhaler|steroid|controller|medicine|medication|pump)/, /\bcan i stop\b/, /\bwhen (can|should|do) i stop/],
    response: `**Please don't stop asthma medicines on your own** — here's why:\n\nFeeling well usually means the **medicine is working**, not that asthma has gone away. When controllers are stopped abruptly, airway inflammation returns silently over weeks, and the next attack can hit without warning.\n\n**The safe path:**\n• If you've been **completely symptom-free for 3+ months**, your doctor may *step down* the dose gradually\n• This is a planned, monitored reduction — not stopping\n• Keep your reliever available even after stepping down\n\nWant to reduce medicines? That's a great goal — achieve it **together with your doctor**, along with trigger control and good technique.`,
    chips: ['Are steroid inhalers safe?', 'Controller inhalers explained', 'Control self-check'],
  },
  {
    id: 'dosage',
    patterns: [/\b(how many|how much)\b.*\b(puff|dose|mg|ml)\b/, /\bdosage\b/, /\bdose of\b/, /\bprescribe\b/, /\bhow many times (can|should) (i|we) use/],
    response: `I can't prescribe or change doses — that must come from **your doctor**, who knows your history, weight, and severity. The same inhaler can be used very differently for a child vs an adult, or mild vs severe asthma.\n\n**What I can safely share:**\n• Follow the exact dose on your prescription label & written action plan\n• During an attack, standard first-aid guidance is **1 reliever puff every 30–60 seconds, up to 10 puffs**, while arranging medical help if it's not working\n• More puffs ≠ better control — needing frequent reliever doses signals you need a controller review\n\nIf your current dose isn't controlling symptoms, that's a sign to book a review — not to self-adjust.`,
    chips: ['Asthma attack first aid', 'Reliever vs preventer', 'When should I see a doctor?'],
  },
  {
    id: 'technique',
    patterns: [/\btechnique\b/, /\bhow to (use|take) (the |an |my )?(inhaler|pump|mdi|puffer)/, /\binhaler (use|steps|guide)/, /\bspacer\b/],
    response: `**Up to 9 out of 10 patients use inhalers incorrectly** — meaning medicine lands in the mouth instead of the lungs. Here's the correct **metered-dose inhaler (MDI)** technique:\n\n1. Remove cap, **shake** the inhaler for 5 seconds\n2. **Breathe out fully** (away from the inhaler)\n3. Seal lips around the mouthpiece — attach a **spacer** if you have one\n4. Start a **slow, deep breath in** and press the canister **once** at the same time\n5. Keep inhaling slowly until lungs are full\n6. **Hold your breath ~10 seconds**, then breathe out gently\n7. Wait 30–60 seconds between puffs; **rinse your mouth** after steroid inhalers\n\n💡 A spacer dramatically improves delivery — especially for children and during attacks. Ask your doctor or pharmacist to watch your technique at every visit.`,
    chips: ['What is a spacer?', 'Reliever vs preventer', 'Asthma attack first aid'],
  },
  {
    id: 'spacer',
    patterns: [/\bspacer/, /\baerochamber/, /\bholding chamber/],
    response: `A **spacer** is a plastic chamber that attaches to your inhaler and holds the medicine cloud, so you can breathe it in calmly without perfect timing.\n\n**Why it matters:**\n• More medicine reaches the lungs, less stays in the mouth\n• Removes the need to perfectly coordinate "press and breathe"\n• **Strongly recommended** for children, elderly patients, and everyone during attacks\n• Reduces hoarseness and thrush from steroid inhalers\n\n**Care:** wash weekly in warm water with a drop of dish soap, and let it air-dry without rinsing or toweling (static reduces effectiveness).\n\nAsk at any pharmacy — they're inexpensive and often free with an inhaler prescription.`,
    chips: ['Inhaler technique', 'Asthma attack first aid'],
  },
  {
    id: 'action_plan',
    patterns: [/\baction plan/, /\b(green|yellow|red) zone/, /\btraffic light/, /\bwritten plan/],
    response: `An **asthma action plan** is a personalised, written one-pager (made with your doctor) that tells you exactly what to do each day and when symptoms change. It uses a **traffic-light system**:\n\n🟢 **GREEN — Go (peak flow 80–100% of your best):** breathing easy. Take your daily controller as usual.\n\n🟡 **YELLOW — Caution (50–79%):** cough, wheeze, night waking, or needing reliever more. Use reliever, follow your plan's extra steps, and contact your doctor within 24–48 hours.\n\n🔴 **RED — Danger (below 50%):** severe breathlessness, can't speak full sentences, reliever not helping. Take reliever now and **seek emergency care**.\n\nPatients with a written action plan have dramatically fewer hospital visits. You can generate a draft plan with our **AI Action Plan Generator** in the AI Tools section — then review it with your doctor.`,
    chips: ['What is peak flow?', 'Asthma attack first aid', 'Control self-check'],
  },
  {
    id: 'peak_flow',
    patterns: [/\bpeak ?flow\b/, /\bpef\b/, /\bpersonal best\b/, /\bpeak expiratory/],
    response: `A **peak flow meter** is a small handheld device measuring how fast you can blow air out (L/min) — a simple way to track airway narrowing at home.\n\n**How to use it:**\n1. Stand, set marker to zero\n2. Take the deepest breath you can\n3. Seal lips around the mouthpiece and blow out **as hard and fast as possible** (like blowing out candles)\n4. Repeat 3 times; record the **highest** reading\n\n**Your "personal best"** = the highest reading you reach over 2 weeks when well. All future zones are percentages of it:\n• ≥80% → Green • 50–79% → Yellow • <50% → Red\n\nCheck twice daily when unwell, or every morning for ongoing monitoring. Falling readings warn of trouble **before** you feel symptoms — that's their superpower.`,
    chips: ['Asthma action plan', 'Green, yellow, red zones', 'Common symptoms'],
  },
  {
    id: 'attack',
    patterns: [/\battack (first aid|steps|help)/, /\bwhat to do (during|in) (an |a )?(asthma )?attack/, /\binhaler not (working|helping)/, /\bfirst aid/, /\bmy (child|son|daughter|baby) (is|cant)/, /\bgetting worse/],
    response: `**Asthma attack first aid** — remember these steps:\n\n1. **Sit the person upright** — never let them lie down. Loosen tight clothing.\n2. **Keep them calm** — panic worsens breathing. Encourage slow, steady breaths.\n3. **Reliever inhaler:** 1 puff every 30–60 seconds, **up to 10 puffs** (use a spacer if available).\n4. **Call an ambulance** (India 108/102 · US 911) if: no improvement after 10 puffs, symptoms are worsening, they can't speak in sentences, lips look blue, or they seem exhausted/drowsy.\n5. If help is delayed beyond 15 minutes, **repeat step 3** while waiting.\n\n**Never** leave the person alone, and never hesitate to call emergency services "too early" — it's always better to be safe.`,
    chips: ['Warning signs of an attack', 'Green, yellow, red zones', 'Reliever vs preventer'],
  },
  {
    id: 'warning_signs',
    patterns: [/\bwarning sign/, /\bdanger sign/, /\bwhen (to go|should i go|is it) (to )?(the )?(hospital|er|emergency)/, /\bserious\b/],
    response: `**Go to emergency care immediately if any of these appear:**\n\n🚩 Too breathless to speak in full sentences\n🚩 Reliever gives no relief, or relief lasts under 3 hours\n🚩 Lips, tongue or fingernails turning blue or grey\n🚩 Skin pulling in around ribs/neck with each breath\n🚩 Peak flow below 50% of personal best after reliever\n🚩 Drowsiness, confusion, or exhaustion from breathing effort\n🚩 A "silent chest" — severe airflow so low that even wheeze disappears\n\nThese signs mean airways are dangerously narrowed. **Don't wait to see if it passes.** Call an ambulance (India 108/102 · US 911), sit upright, and keep using the reliever while waiting.`,
    chips: ['Asthma attack first aid', 'Green, yellow, red zones'],
  },
  {
    id: 'control',
    patterns: [/\b(controlled|uncontrolled|under control|control (my|the) asthma|out of control)\b/, /\bcontrol (check|test)\b/],
    response: `**Well-controlled asthma looks like this (over the past 4 weeks):**\n\n✅ Daytime symptoms **no more than twice a week**\n✅ **Zero** night-time waking from asthma\n✅ Reliever needed **no more than twice a week**\n✅ **No limits** on work, school or exercise\n✅ No attacks needing emergency care or steroid tablets\n\nIf you're failing even one or two of these, your treatment plan likely needs adjusting — asthma control is achievable for most people.\n\nTry our **60-second Control Check** on this page, or paste how you've been feeling into the **AI Symptom Analyzer** for a detailed breakdown.`,
    chips: ['Night-time symptoms', 'Reliever vs preventer', 'When should I see a doctor?'],
  },
  {
    id: 'night',
    patterns: [/\b(night|nocturnal|sleep|waking|wake up|midnight|2 am|3 am|early morning)\b/],
    response: `**Night-time asthma** is very common — and very informative.\n\n**Why it happens:**\n• Body's natural anti-inflammatory hormones dip overnight (around 2–4 am)\n• Dust mites concentrated in bedding\n• Lying flat can trigger acid reflux and post-nasal drip\n• Cooler bedroom air\n\n**What to do:**\n• Allergen-proof mattress & pillow covers; wash bedding hot weekly\n• Keep the bedroom a pet-free, smoke-free zone\n• Manage reflux: no heavy meals 3 hours before bed\n• Take controller doses consistently every day\n\n🚩 **Key message:** waking at night is a classic sign of **poor control** — mention it at your next appointment rather than accepting broken sleep as "normal".`,
    chips: ['Dust mite tips', 'Control self-check', 'Nocturnal asthma type'],
  },
  {
    id: 'exercise',
    patterns: [/\b(exercise|exercising|gym|sport|run|running|play|football|cricket|swimming|yoga|walk(ing)?)\b.*\b(asthma|safe|ok|okay|can i|should i)?/, /\bcricket\b/, /\bcan i (play|run|exercise|gym|do gym)/],
    response: `**Yes — exercise is encouraged with asthma!** Many Olympic and international athletes compete with it. The goal is control, not avoidance.\n\n**Exercise smart:**\n• Get asthma well controlled first — daily controller makes activity far easier\n• **Warm up** gradually for 10–15 minutes\n• Use your reliever 10–15 min before sport **if your doctor advises**\n• Keep the reliever in your gym bag — always\n• Asthma-friendly options: swimming (warm humid air), walking, cycling, yoga, cricket (stop-start pattern)\n• Cold-weather sports need more care: cover your mouth, breathe through the nose\n\n🚩 If exercise regularly triggers symptoms, your overall control needs reviewing — tell your doctor rather than quitting activity.\n\n**Breathing exercises** (like pranayama, Buteyko) can complement — never replace — medication.`,
    chips: ['Exercise-induced asthma', 'Breathing exercises', 'Control self-check'],
  },
  {
    id: 'children',
    patterns: [/\b(child|children|kid|kids|baby|toddler|infant|son|daughter|school)\b/],
    response: `**Asthma is the most common chronic disease of childhood** — but children with well-managed asthma play, study and compete normally.\n\n**For parents:**\n• Children may describe symptoms as "tummy ache" or simply avoid running — watch for night cough\n• **Spacers are essential** for young children; masks attach for under-5s\n• Share a copy of the action plan with the school and class teacher\n• Never stop preventer inhalers because the child "seems fine"\n• Second-hand smoke exposure is a major, preventable attack trigger\n\n**Will they outgrow it?** Some children — especially those with mild, allergy-linked wheeze — see symptoms fade in the teens. But airway sensitivity often remains and can return in adulthood. Regular reviews (every 3–6 months for kids) keep treatment matched to their growth.`,
    chips: ['Smoking and asthma', 'Asthma attack first aid', 'Controller inhalers explained'],
  },
  {
    id: 'contagious',
    patterns: [/\bcontagious\b/, /\b(spread|catch|caught|infect(ious|ion)?)\b.*\basthma/, /\basthma.*(spread|catch)/],
    response: `**No — asthma is NOT contagious.** You cannot catch it from another person, share it through touch, food, air, or living together.\n\nIt develops from a combination of **genetic tendency** and **environmental factors** (allergens, pollution, early-life infections).\n\nOne nuance: the **colds and flu** that trigger asthma attacks ARE contagious — so good hygiene and vaccination matter for people with asthma. You can confidently reassure anyone who asks: asthma patients are safe to be around! 💙`,
    chips: ['What causes asthma?', 'Vaccines and asthma', 'Common triggers'],
  },
  {
    id: 'curable',
    patterns: [/\b(cure|curable|cured|permanent(ly)? (cure|solution)|go away|eliminate asthma)\b/],
    response: `Honest answer: **there is currently no cure for asthma** — but there's excellent news too.\n\nWith modern treatment, most people achieve **complete control**: no daily symptoms, no night waking, full activity, no emergency visits. At that point asthma barely affects your life.\n\n**Be wary of anyone promising a permanent cure** — miracle remedies and unverified "root treatments" lead many patients to stop inhalers, sometimes with fatal results. Evidence-based care, trigger management and regular reviews are the real path.\n\nSome children's symptoms do fade as they grow. And exciting research (biologics, immunotherapy) keeps improving outcomes — especially for severe asthma.`,
    chips: ['Is asthma genetic?', 'Asthma in children', 'Living well tips'],
  },
  {
    id: 'diet',
    patterns: [/\b(diet|food|eat|eating|nutrition|milk|curd|dairy|banana|cold (food|drink)|ice cream|chocolate)\b/],
    response: `**No single food cures or causes asthma**, but diet does matter:\n\n**Helpful patterns:**\n• Fruits & vegetables rich in antioxidants (vitamin C, E) are associated with better lung function\n• Oily fish, nuts, seeds — anti-inflammatory omega-3s\n• Maintaining a **healthy weight** — obesity makes asthma harder to control\n\n**Watch-outs:**\n• Sulphite preservatives (dried fruits, packaged juices, some pickles) trigger symptoms in a minority\n• True food allergy can worsen asthma — get suspected reactions tested rather than cutting out whole food groups\n• **Milk doesn't increase mucus** — that's a myth; restrict dairy only if a doctor confirms allergy\n• Heavy late meals worsen reflux → night symptoms\n\nTraditional advice to avoid "cold items" lacks evidence, but if YOU notice a consistent personal trigger, avoiding it is reasonable.`,
    chips: ['Living well tips', 'What causes asthma?', 'Common triggers'],
  },
  {
    id: 'stress',
    patterns: [/\b(stress|anxiety|anxious|panic|depress|tension|worr(y|ied)|cry|emotional)\b/],
    response: `**Stress and emotions genuinely affect asthma** — strong feelings (anxiety, anger, even hard laughter) change breathing patterns and can tighten airways.\n\n**Breaking the cycle** (breathlessness → panic → worse breathlessness):\n• **Pursed-lip breathing:** in through the nose 2 counts, out slowly through pursed lips 4 counts — this calms both mind and airways\n• Regular sleep, movement, and limiting caffeine\n• Breathing-based practices: pranayama, yoga, mindfulness\n• If anxiety about your asthma is frequent, tell your doctor — treating it improves asthma control\n\nImportant difference: during a true asthma attack, reliever medicine is still needed — relaxation complements, never replaces, your inhaler.`,
    chips: ['Night-time symptoms', 'Breathing exercises', 'Common triggers'],
  },
  {
    id: 'vaccine',
    patterns: [/\b(vaccin|immunis|immuniz|flu shot|influenza|pneumonia|covid)\b/],
    response: `**Vaccination is especially important for people with asthma**, because respiratory infections are the most common attack trigger — with less lung reserve to spare.\n\n**Discuss with your doctor:**\n• **Annual flu shot** — the most important one for asthma patients\n• **Pneumococcal vaccine** — recommended for asthma (especially adults)\n• **COVID-19** boosters per current national guidance\n• **RSV vaccine** — now available for older adults\n• Children's routine immunisations — asthma is **not** a reason to skip them\n\nAsthma medicines (including inhaled steroids) don't interfere with vaccines. The best time to vaccinate is when asthma is well controlled, before flu season (September–October is ideal in India).`,
    chips: ['What causes asthma?', 'Living well tips', 'Asthma in children'],
  },
  {
    id: 'pregnancy',
    patterns: [/\b(pregnan|expecting|baby .*(on the way|coming)|breast.?feed)/],
    response: `**Asthma and pregnancy — the key facts:**\n\n• Well-controlled asthma almost always means a **healthy pregnancy and baby**\n• **Keep taking your inhalers.** Inhaled steroids and relievers are considered safe in pregnancy; uncontrolled asthma is far riskier for the baby than the medicines are\n• About ⅓ of pregnant women improve, ⅓ stay the same, ⅓ worsen — usually in weeks 24–36\n• More frequent check-ups are worthwhile; controlled asthma reduces risks of pre-eclampsia and low birth weight\n• During labour, asthma attacks are rare — bring your inhaler anyway\n• **Don't smoke, and avoid second-hand smoke** — it directly affects the baby's future lung health\n\nNever stop medicines because of pregnancy until your doctor says so — plan a medication review early in pregnancy.`,
    chips: ['Controller inhalers explained', 'Asthma in children', 'Is asthma genetic?'],
  },
  {
    id: 'severe',
    patterns: [/\bsevere asthma\b/, /\bbiologic/, /\bomalizumab\b/, /\bdupilumab\b/, /\bmepolizumab\b/, /\bsteroid tablet/, /\bprednis/, /\bdifficult asthma/],
    response: `**Severe asthma** affects roughly 5–10% of patients — symptoms and attacks persist despite high-dose inhalers used correctly.\n\n**What specialist care offers today:**\n• **Confirmation first** — ruling out wrong diagnosis, poor technique, untreated triggers (many "severe" cases turn out to be fixable!)\n• **Phenotyping** — blood eosinophils, IgE, FeNO to identify your asthma type\n• **Biologic injections** (e.g., omalizumab, mepolizumab, dupilumab) — targeted antibodies that have transformed severe asthma care, dramatically cutting attacks and steroid tablet use for the right patients\n• Managing co-existing issues: nasal polyps, reflux, sinusitis, obesity\n\nFrequent courses of steroid tablets signal the need for specialist referral — ask about a **severe asthma clinic or pulmonologist** if this sounds like you.`,
    chips: ['Controller inhalers explained', 'When should I see a doctor?', 'Control self-check'],
  },
  {
    id: 'see_doctor',
    patterns: [/\bsee (a |the )?doctor\b/, /\bwhich doctor/, /\bspecialist\b/, /\bpulmonolog/, /\bappointment\b/, /\bconsult/],
    response: `**See a doctor when:**\n• You suspect asthma but haven't been diagnosed\n• Symptoms more than twice a week, any night waking, or reliever needed more than twice a week\n• After ANY emergency visit or attack — a plan review is essential\n• At least **once or twice a year** even when perfectly controlled\n• Before stopping or changing any medication\n\n**Who treats asthma?** A general physician manages most asthma well; a **pulmonologist** (chest specialist) is best for difficult, severe or unclear cases. For children, a paediatrician or paediatric pulmonologist.\n\nBring to your visit: symptom diary, inhalers (for technique check), peak flow records, and your written action plan.`,
    chips: ['Control self-check', 'Asthma action plan', 'Severe asthma'],
  },
  {
    id: 'types',
    patterns: [/\btypes? of asthma\b/, /\bkind(s)? of asthma\b/],
    response: `Asthma shows up in several forms:\n\n• **Allergic (atopic)** — most common; triggered by dust, pollen, pets; often with eczema/hay fever\n• **Exercise-induced (EIB)** — airways narrow during/after activity, especially cold air\n• **Occupational** — caused by workplace exposures (flour, chemicals, fumes)\n• **Nocturnal** — symptoms flare at night, a marker of control\n• **Cough-variant** — chronic dry cough is the main/only symptom\n• **Aspirin-exacerbated (AERD)** — reactions to aspirin/NSAIDs, often with nasal polyps\n• **Severe asthma** — persists despite high-dose treatment\n\nMany people have a mix. You can explore each type with more detail in the **Types of Asthma** section on this page.`,
    chips: ['Exercise-induced asthma', 'Nocturnal asthma type', 'Occupational asthma'],
  },
  {
    id: 'cough_variant',
    patterns: [/\bcough.variant/, /\b(chronic|persistent|dry|long.standing|lingering) cough/, /\bcough (for|since) (weeks|months|\d)/, /\bonly cough/],
    response: `**Cough-variant asthma** is exactly what it sounds like — asthma whose main (sometimes only) symptom is a **persistent dry cough**, usually without obvious wheeze.\n\n**Clues it might be CVA:**\n• Cough lasting **more than 6–8 weeks**\n• Worse at night, with exercise, cold air or dust\n• Normal chest X-ray; little response to cough syrups/antibiotics\n• Improves with asthma inhalers\n\nIt's frequently misdiagnosed as a "lingering cold" or throat problem. Untreated, it can progress to classic asthma — so if this sounds like you, ask a doctor about spirometry. One silver lining: it responds well to standard asthma treatment.`,
    chips: ['How is asthma diagnosed?', 'Night-time symptoms', 'Types of asthma'],
  },
]

/* Fallback when nothing matches confidently */
const FALLBACK = {
  response: `That's a great question — and I want to make sure I give you accurate information. 🤔\n\nI'm best at answering questions about:\n• **Symptoms & diagnosis** — "how is asthma diagnosed?"\n• **Triggers** — "does cold weather affect asthma?"\n• **Medicines** — "what's the difference between reliever and preventer?"\n• **Daily life** — "can I exercise with asthma?"\n• **Emergencies** — "asthma attack first aid"\n\nCould you rephrase, or pick one of these topics?`,
  chips: ['What is asthma?', 'Common triggers?', 'Reliever vs preventer', 'Asthma attack first aid'],
}

/** Match a user message against the KB; returns a response object. */
export function getResponse(rawInput) {
  const text = normalize(rawInput)

  if (detectEmergency(text)) return { ...EMERGENCY_RESPONSE }

  let best = null
  let bestScore = 0
  for (const item of KB) {
    let score = 0
    for (const re of item.patterns) {
      if (re.test(text)) score += 2
      // Bonus for unique keyword hits
      const m = text.match(re)
      if (m) score += Math.min(m[0].length / 8, 2)
    }
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }

  if (best && bestScore >= 2.5) {
    return { role: 'assistant', text: best.response, chips: best.chips || [] }
  }
  return { role: 'assistant', text: FALLBACK.response, chips: FALLBACK.chips }
}

export const DEFAULT_CHIPS = [
  'What is asthma?',
  'Common symptoms',
  'Reliever vs preventer',
  'Asthma attack first aid',
  'Is asthma curable?',
]

/* ------------------------------------------------------------------ */
/* AI Symptom Analyzer — parses free text into structured insight     */
/* ------------------------------------------------------------------ */
export function analyzeSymptoms(raw) {
  const t = normalize(raw)
  const found = { symptoms: [], timing: [], notes: [] }
  let score = 0

  const has = re => re.test(t)

  // --- emergency first ---
  const emergency = detectEmergency(t)

  // --- symptoms ---
  if (has(/\bwheez/)) { found.symptoms.push('Wheezing'); }
  if (has(/\bcough/)) { found.symptoms.push('Coughing'); }
  if (has(/\b(short of breath|breathless|breathing (problem|difficulty|trouble)|difficulty breathing|hard to breathe|heavy breathing|out of breath)\b/)) { found.symptoms.push('Breathlessness'); }
  if (has(/\b(chest (tight|pain|pressure)|tight(ness)? (in|of) (the )?chest)\b/)) { found.symptoms.push('Chest tightness'); }
  if (has(/\b(mucus|phlegm|sputum|balgam)\b/)) { found.symptoms.push('Mucus / phlegm'); }
  if (has(/\b(tired|fatigue|exhausted|no energy|low stamina)\b/)) { found.symptoms.push('Fatigue'); }
  if (has(/\b(cant sleep|not sleeping|waking up|wake up (at|in) night|disturbed sleep)\b/)) { found.symptoms.push('Sleep disturbance'); }

  // --- timing / pattern ---
  if (has(/\b(night|midnight|early morning|2 ?am|3 ?am|4 ?am|sleep)\b/)) { found.timing.push('Night / early morning'); score += 1; }
  if (has(/\b(exercise|running|gym|playing|walking|sport|climbing stairs|stairs)\b/)) { found.timing.push('During / after exercise'); }
  if (has(/\b(morning)\b/)) found.timing.push('Morning')
  if (has(/\b(dust|cleaning|sweeping|pollution|smoke|smoking|cold air|winter|monsoon|pollen|season|weather|perfume|incense|agarbatti|pets?|dog|cat)\b/)) found.timing.push('Around known triggers')

  // --- frequency (daytime symptoms) ---
  let dayFreq = null
  if (has(/\b(every ?day|daily|all the time|always|constant|whole day|multiple times a day)\b/)) dayFreq = 'daily'
  else if (has(/\b(twice a week|2 times a week|two times a week|few times a week|2-3 times|three times a week|every other day)\b/)) dayFreq = 'frequent'
  else if (has(/\b(once a week|weekly|sometimes|occasionally|rarely|once in a while)\b/)) dayFreq = 'occasional'
  if (dayFreq === 'daily') { score += 1; found.notes.push('Daytime symptoms reported daily') }
  else if (dayFreq === 'frequent') score += 1

  // --- reliever use ---
  const rel = /\b(reliever|rescue|blue inhaler|salbutamol|asthalin|ventolin|levolin|inhaler)\b/.test(t)
  let relFreq = null
  if (rel && has(/\b(every ?day|daily|multiple times (a )?day|all the time|\d+ (times|puffs?) (a|per) day)\b/)) relFreq = 'daily'
  else if (rel && has(/\b(twice a week|few times a week|2-3 times a week|every other day|often)\b/)) relFreq = 'frequent'
  else if (rel && has(/\b(once a week|rarely|occasionally|sometimes)\b/)) relFreq = 'occasional'
  if (relFreq === 'daily') { score += 1; found.notes.push('Reliever used daily — a key control warning sign') }
  else if (relFreq === 'frequent') score += 1

  // --- activity limitation ---
  const limited = has(/\b(cant (walk|exercise|run|play|work|climb)|unable to (walk|work|exercise)|avoid (exercise|stairs|walking)|stop(s|ped)? (me|playing)|miss(ed)? (work|school)|limit(s|ing)? (my|me))\b/)
  if (limited) { score += 1; found.notes.push('Daily activities appear limited by symptoms') }

  // --- severity / red flags ---
  const redFlags = []
  if (has(/\b(cant (speak|talk) (in )?(full )?(sentence|properly)|cant complete (a )?sentence|one word at a time)\b/)) redFlags.push('Too breathless to speak in full sentences')
  if (has(/\b(blue lips|lips (turn(ed|ing)? )?blue|blue (finger)?nails)\b/)) redFlags.push('Blueness of lips or nails')
  if (has(/\b(inhaler (is )?not (working|helping)|no relief (from|with) (inhaler|reliever|pump))\b/)) redFlags.push('Reliever not providing relief')
  if (has(/\b(hospital|emergency|icu|nebuliz|admitted|steroid (tablet|course|pill)|prednis)/)) { redFlags.push('Recent emergency care / steroid course mentioned') }
  if (has(/\b(getting worse|worsening|much worse|worst)\b/)) redFlags.push('Symptoms reported as worsening')

  // --- control estimate ---
  let tier
  if (redFlags.length >= 2 || emergency) tier = 'urgent'
  else if (redFlags.length === 1) tier = 'uncontrolled'
  else if (score >= 3) tier = 'uncontrolled'
  else if (score >= 1) tier = 'partly'
  else tier = 'good'

  const gauge = { good: 12, partly: 38, uncontrolled: 68, urgent: 92 }[tier]

  // --- advice ---
  const advice = []
  if (emergency || redFlags.length >= 2) {
    advice.push('Seek emergency medical care now — sit upright, take your reliever (up to 10 puffs), and call 108 / 102 (India) or your local emergency number.')
  }
  if (tier === 'uncontrolled' || (tier === 'urgent' && !emergency)) {
    advice.push('Book a doctor\'s appointment as soon as possible — within days, not weeks. Your treatment plan likely needs strengthening.')
  }
  if (found.timing.includes('Night / early morning')) {
    advice.push('Night symptoms point to under-controlled asthma — mention them specifically at your visit, and use allergen-proof bedding in the meantime.')
  }
  if (relFreq === 'daily' || relFreq === 'frequent') {
    advice.push('Frequent reliever use is one of the strongest signs of poor control. Do NOT simply use it more — ask your doctor about daily controller therapy.')
  }
  if (found.timing.includes('Around known triggers')) {
    advice.push('A trigger pattern seems present. Start a 2-week symptom-and-trigger diary — it helps your doctor fine-tune treatment and avoidance strategies.')
  }
  if (tier === 'good' || tier === 'partly') {
    advice.push('Keep taking your daily controller inhaler exactly as prescribed — even on days you feel fine.')
  }
  if (!rel && tier !== 'good') {
    advice.push('If you have a reliever inhaler, keep it with you at all times, especially during activities.')
  }
  advice.push('Review your inhaler technique with a doctor, nurse or pharmacist — most patients have at least one correctable step.')

  const doctorQuestions = [
    'Based on my symptoms, is my asthma currently well controlled?',
    'Should my controller dose be adjusted, or do I need a review of my written action plan?',
    'Can we check my inhaler technique and peak flow personal best?',
    relFreq ? 'I use my reliever often — is that a concern?' : 'Do I need to carry a reliever everywhere?',
    found.timing.length ? 'My symptoms follow a pattern (' + found.timing.join(', ').toLowerCase() + ') — what does that suggest?' : 'What triggers should I specifically watch for?',
  ]

  return {
    tier, gauge, score, emergency,
    symptomsFound: found.symptoms,
    timing: found.timing,
    notes: found.notes,
    redFlags, advice, doctorQuestions,
    nothingFound: found.symptoms.length === 0 && found.timing.length === 0 && !rel,
    relieverMentioned: rel,
  }
}

/* ------------------------------------------------------------------ */
/* AI Action Plan Generator                                           */
/* ------------------------------------------------------------------ */
export function generatePlan(data) {
  const {
    name, ageGroup, controller, reliever, personalBest,
    nightSymptoms, exerciseSymptoms, relieverFreq, triggers,
  } = data

  const best = parseFloat(personalBest)
  const hasBest = !Number.isNaN(best) && best >= 50 && best <= 900
  const green = hasBest ? `≥ ${Math.round(best * 0.8)} L/min` : '80–100% of personal best'
  const yellow = hasBest ? `${Math.round(best * 0.5)}–${Math.round(best * 0.8)} L/min` : '50–79% of personal best'
  const red = hasBest ? `< ${Math.round(best * 0.5)} L/min` : 'below 50% of personal best'

  const daily = [
    `Take controller inhaler (${controller || 'as prescribed by your doctor'}) EVERY day — even when you feel well.`,
    `Carry your reliever (${reliever || 'salbutamol / blue inhaler'}) everywhere: home, work/school, gym, travel.`,
    'Rinse your mouth after each controller dose.',
    'Check inhaler technique at every doctor visit.',
  ]
  if (triggers.length) {
    daily.push('Actively avoid your known triggers: ' + triggers.join(', ') + '.')
  }
  if (exerciseSymptoms === 'yes') {
    daily.push('Use reliever 10–15 minutes before exercise if your doctor has advised it; always warm up first.')
  }
  if (nightSymptoms === 'yes') {
    daily.push('Night symptoms history: use allergen-proof bedding, keep pets out of the bedroom, and discuss dose timing with your doctor.')
  }

  const yellowSteps = [
    'Take 2–4 puffs of reliever via spacer; repeat after 20 minutes if needed.',
    'If reliever needed more than every 4 hours or symptoms persist 24–48 hrs — contact your doctor.',
    'Rest from strenuous activity; avoid triggers strictly until back in green zone.',
  ]
  if (parseInt(relieverFreq, 10) >= 3) {
    yellowSteps.unshift('NOTE: you already report using your reliever 3+ times/week — show this plan to your doctor soon; controller may need strengthening.')
  }

  const redSteps = [
    'Sit upright. Stay calm. Do not lie down.',
    'Take 1 puff of reliever every 30–60 seconds, up to 10 puffs.',
    'If no improvement, or worsening: CALL AN AMBULANCE (India 108 / 102 · US 911).',
    'Repeat 10 puffs every 15 minutes while waiting for help.',
    'Signs that demand immediate help: cannot speak full sentences, lips turning blue, exhaustion, or reliever not lasting 3 hours.',
  ]

  const flags = []
  if (parseInt(relieverFreq, 10) >= 3) flags.push('Frequent reliever use')
  if (nightSymptoms === 'yes') flags.push('Night-time symptoms')
  if (exerciseSymptoms === 'yes') flags.push('Exercise limitation')

  return {
    name: name?.trim() || 'My',
    ageGroup,
    date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    green, yellow, red, daily, yellowSteps, redSteps, flags,
    hasBest: !!hasBest, personalBest: hasBest ? best : null,
  }
}
