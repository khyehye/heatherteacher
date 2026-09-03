import fs from "fs";
import path from "path";

const root = process.cwd();
const makeOptions = (rows, index) => {
  const answer = rows[index][2];
  const pool = rows.map((row) => row[2]).filter((item) => item !== answer);
  const start = (index * 3) % pool.length;
  const distractors = [pool[start], pool[(start + 7) % pool.length], pool[(start + 15) % pool.length]];
  const answerAt = index % 4;
  const options = [...distractors];
  options.splice(answerAt, 0, answer);
  return { options, correctIndex: answerAt };
};

const phrasalRows = [
  [106, "It's 7:30. Please ___ and get out of bed.", "get up", "get up은 잠자리에서 몸을 일으키는 동작을 뜻해요."],
  [110, "I need to ___ why the computer stopped working.", "find out", "find out은 알아내다, 발견하다는 뜻이에요."],
  [114, "The report must ___ every expense.", "account for", "account for는 이유나 수량을 설명하다라는 뜻이에요."],
  [121, "I usually ___ before my alarm rings.", "wake up", "wake up은 잠에서 깨는 상태 변화를 말해요."],
  [125, "We ___ seeing you again next month.", "look forward to", "look forward to 뒤에는 명사나 동명사가 와요."],
  [129, "The new policy may ___ major changes.", "bring about", "bring about은 어떤 결과나 변화를 초래하다는 뜻이에요."],
  [136, "It's cold outside, so ___ your coat.", "put on", "put on은 옷을 입는 동작을 나타내요."],
  [140, "Mina ___ all her classmates.", "gets along with", "get along with는 누구와 잘 지내다는 뜻이에요."],
  [144, "Despite the noise, she decided to ___ working.", "carry on", "carry on은 하던 일을 계속하다는 뜻이에요."],
  [151, "Please ___ your shoes at the door.", "take off", "take off는 옷이나 신발을 벗다는 뜻이에요."],
  [155, "The police will ___ the cause of the accident.", "look into", "look into는 문제나 사건을 조사하다는 뜻이에요."],
  [159, "I ___ an old photo while cleaning my room.", "came across", "come across는 우연히 발견하거나 마주치다는 뜻이에요."],
  [166, "It's dark. Please ___ the light.", "turn on", "turn on은 전등이나 기기를 켜다는 뜻이에요."],
  [170, "Can you ___ a better solution?", "come up with", "come up with는 생각이나 해결책을 생각해 내다는 뜻이에요."],
  [174, "The team ___ several unexpected problems.", "came up against", "come up against는 어려움이나 반대에 부딪히다는 뜻이에요."],
  [181, "Don't forget to ___ the TV before bed.", "turn off", "turn off는 전등이나 기기를 끄다는 뜻이에요."],
  [185, "Could you ___ my dog this weekend?", "take care of", "take care of는 사람이나 동물을 돌보다는 뜻이에요."],
  [189, "I'm trying to ___ sugar.", "cut down on", "cut down on은 섭취량이나 사용량을 줄이다라는 뜻이에요."],
  [196, "I'm ___ my missing keys.", "looking for", "look for는 잃어버린 것이나 필요한 것을 찾다는 뜻이에요."],
  [200, "We had to ___ the meeting until Friday.", "put off", "put off는 일정이나 일을 미루다는 뜻이에요."],
  [204, "The company plans to ___ unnecessary paperwork.", "do away with", "do away with는 불필요한 것을 없애다는 뜻이에요."],
  [211, "___ the picture on the wall.", "Look at", "look at은 시선을 두어 보다라는 뜻이에요."],
  [215, "The researchers will ___ a new experiment.", "carry out", "carry out은 계획이나 실험을 수행하다는 뜻이에요."],
  [219, "Try not to ___ your past mistakes.", "dwell on", "dwell on은 좋지 않은 일을 오래 생각하다는 뜻이에요."],
  [226, "My aunt ___ me when my parents are away.", "looks after", "look after는 사람이나 동물을 돌보다는 뜻이에요."],
  [230, "He didn't want to ___ the sensitive topic.", "bring up", "bring up은 대화에서 화제를 꺼내다는 뜻이에요."],
  [234, "In an emergency, we can ___ our savings.", "fall back on", "fall back on은 어려울 때 무언가에 의지하다는 뜻이에요."],
  [241, "Don't ___ just because the problem is difficult.", "give up", "give up은 하던 일을 포기하다는 뜻이에요."],
  [245, "My car ___ on the way to school.", "broke down", "break down은 기계나 차량이 고장 나다는 뜻이에요."],
  [249, "We found a way to ___ the rule.", "get around", "get around은 문제나 규칙을 교묘히 피하다는 뜻이에요."],
  [256, "What time will you ___ home?", "come back", "come back은 원래 있던 곳으로 돌아오다는 뜻이에요."],
  [260, "Jina and Tom decided to ___ last week.", "break up", "break up은 연인 관계를 끝내다라는 뜻이에요."],
  [264, "Fear should not ___ you from trying.", "hold back", "hold back은 행동이나 발전을 막거나 억제하다는 뜻이에요."],
  [271, "We often ___ for dinner on Fridays.", "go out", "go out은 외출하거나 밖에서 시간을 보내다는 뜻이에요."],
  [275, "They ___ the picnic because of the storm.", "called off", "call off는 예정된 행사를 취소하다는 뜻이에요."],
  [279, "The movie didn't ___ my expectations.", "live up to", "live up to는 기대나 기준에 부응하다는 뜻이에요."],
  [286, "___ the car carefully; traffic is heavy.", "Get in", "get in은 승용차나 택시에 타다는 뜻이에요."],
  [290, "Guests must ___ at the front desk.", "check in", "check in은 호텔이나 공항에서 도착 등록을 하다는 뜻이에요."],
  [294, "You should never ___ people because of their jobs.", "look down on", "look down on은 다른 사람을 얕보다는 뜻이에요."],
  [301, "Please ___ and make yourself comfortable.", "sit down", "sit down은 서 있는 상태에서 앉다는 뜻이에요."]
];

const phrasalQuestions = phrasalRows.map((row, index) => ({
  id: `pv-${index + 1}`,
  prompt: row[1],
  ...makeOptions(phrasalRows, index),
  explanation: row[3],
  sourceEpisode: row[0]
}));

const confusionRows = [
  [107, "The weather can ___ your mood.", ["affect", "effect", "effects", "affected by"], 0, "동사 affect는 ‘영향을 미치다’라는 뜻이에요."],
  [111, "The committee is ___ ten members.", ["comprised of", "composed", "consist of", "comprising of"], 0, "be comprised of는 ‘~로 구성되다’라는 뜻이에요."],
  [118, "Finish your homework, ___ you can play.", ["than", "then", "them", "that"], 1, "순서를 나타내는 부사는 then이에요."],
  [122, "Everyone ___ Mina attended the meeting.", ["accept", "except", "expect", "accepted"], 1, "‘~을 제외하고’라는 뜻의 전치사는 except예요."],
  [126, "From her smile, I ___ that she was pleased.", ["implied", "inferred", "referred", "assured"], 1, "근거를 보고 결론을 내리는 사람은 infer해요."],
  [133, "The dog wagged ___ tail.", ["it's", "its", "it", "its'"], 1, "소유격 its에는 아포스트로피를 쓰지 않아요."],
  [137, "My teacher gave me useful ___.", ["advise", "advice", "advises", "advisor"], 1, "명사 ‘조언’은 advice, 동사 ‘조언하다’는 advise예요."],
  [141, "We need to discuss this issue ___.", ["farther", "further", "farthest", "furthest away"], 1, "추가적인 논의를 뜻할 때는 further를 써요."],
  [148, "___ going to love this book.", ["Your", "You're", "Yours", "Youre"], 1, "You're는 you are의 줄임말이에요."],
  [152, "The secret was shared ___ the three friends.", ["between", "among", "beside", "across"], 1, "셋 이상의 집단 속에서 나누는 관계에는 among을 써요."],
  [156, "Please ___ that every window is locked.", ["assure", "ensure", "insure", "reassure"], 1, "어떤 일이 반드시 이루어지게 한다는 뜻은 ensure예요."],
  [163, "I ate ___ much cake at the party.", ["to", "too", "two", "toward"], 1, "‘지나치게’라는 뜻의 부사는 too예요."],
  [167, "___ English, she studies French.", ["Beside", "Besides", "Between", "Beyond"], 1, "‘~뿐만 아니라, 게다가’라는 뜻은 besides예요."],
  [171, "It took time to ___ to my new school.", ["adopt", "adapt", "adept", "adjusting"], 1, "새 환경에 적응한다는 뜻은 adapt예요."],
  [178, "Could I ___ your umbrella?", ["lend", "borrow", "loaning", "bring"], 1, "borrow는 남에게서 빌리다, lend는 남에게 빌려주다예요."],
  [182, "The red scarf is a perfect ___ to her coat.", ["compliment", "complement", "completion", "supplemental"], 1, "서로 잘 어울려 완성해 주는 것은 complement예요."],
  [186, "Lunch will ___ the afternoon meeting.", ["proceed", "precede", "process", "preceding"], 1, "시간상 앞서 일어나는 것은 precede예요."],
  [193, "Please ___ me your name.", ["say", "tell", "speak", "talk"], 1, "tell은 바로 뒤에 사람 목적어를 취할 수 있어요."],
  [197, "This small car is very ___ to run.", ["economic", "economical", "economy", "economically car"], 1, "돈이나 연료가 적게 드는 것은 economical이에요."],
  [201, "The suspect managed to ___ the police.", ["allude", "elude", "delude", "include"], 1, "elude는 추적이나 포획을 피하다는 뜻이에요."],
  [208, "Can I ___ to Mr. Lee?", ["talk", "speak", "tell", "say him"], 1, "전화에서 ‘~와 통화하다’는 speak to를 흔히 써요."],
  [212, "The moon landing was a ___ event.", ["historical", "historic", "history", "historically"], 1, "역사적으로 중요한 사건은 historic이라고 해요."],
  [216, "The workbook is designed to ___ the textbook.", ["compliment", "supplement", "implement", "supply to"], 1, "기존 자료에 내용을 보충하는 것은 supplement예요."],
  [223, "I can ___ someone singing outside.", ["listen", "hear", "listen to", "sound"], 1, "의도하지 않아도 소리가 들리는 것은 hear예요."],
  [227, "Of the two plans, I prefer the ___.", ["later", "latter", "latest", "late"], 1, "둘 중 뒤에 언급된 것은 the latter예요."],
  [231, "Dark clouds suggested that a storm was ___.", ["eminent", "imminent", "permanent", "prominent"], 1, "곧 닥칠 듯한 상태는 imminent예요."],
  [238, "We ___ a movie last night.", ["saw at", "watched", "looked", "view to"], 1, "집중해서 영화나 경기를 보는 동사는 watch예요."],
  [242, "Be careful not to ___ your ticket.", ["loose", "lose", "loss", "losting"], 1, "동사 lose는 잃다, 형용사 loose는 헐거운이라는 뜻이에요."],
  [246, "Smoke can ___ sensitive eyes.", ["aggravation", "irritate", "irritated", "aggravatingly"], 1, "눈이나 피부를 자극한다는 뜻에는 irritate가 자연스러워요."],
  [253, "I have ___ close friends, so I'm not lonely.", ["few", "a few", "little", "a little"], 1, "a few는 셀 수 있는 명사가 조금 있어서 긍정적인 뜻이에요."],
  [257, "Honesty is an important ___.", ["principal", "principle", "principally", "principality"], 1, "규칙이나 원칙은 principle이에요."],
  [261, "A fair judge must remain ___.", ["uninterested", "disinterested", "interesting", "disinteresting"], 1, "사적인 이해관계 없이 공정한 상태는 disinterested예요."],
  [268, "There is ___ milk left, enough for one cup.", ["little", "a little", "few", "a few"], 1, "a little은 셀 수 없는 명사가 조금 있다는 긍정 표현이에요."],
  [272, "Please buy some ___ at the bookstore.", ["stationary", "stationery", "station", "stationeries"], 1, "편지지와 문구류는 stationery예요."],
  [276, "The machine makes a ___ humming sound.", ["continual", "continuous", "continuedly", "continuing"], 1, "중단 없이 계속되는 것은 continuous예요."],
  [283, "How ___ water do you drink each day?", ["many", "much", "few", "several"], 1, "셀 수 없는 명사 water 앞에는 much를 써요."],
  [287, "___ did you invite to the party?", ["Who", "Whom", "Whose", "Who's"], 1, "invite의 목적어 자리이므로 격식을 갖춘 문장에서는 whom을 써요."],
  [291, "We need ___ chairs, not less chairs.", ["less", "fewer", "fewest", "little"], 1, "셀 수 있는 복수명사의 수가 더 적다는 뜻은 fewer예요."],
  [298, "Do you have ___ questions?", ["some", "any", "much", "every"], 1, "일반적인 의문문에는 보통 any를 써요."],
  [302, "The book ___ I borrowed is fascinating.", ["which one", "that", "what", "where"], 1, "제한적 용법에서 사물을 받는 목적격 관계대명사로 that을 쓸 수 있어요."]
];

const confusionQuestions = confusionRows.map((row, index) => ({
  id: `cn-${index + 1}`,
  prompt: row[1], options: row[2], correctIndex: row[3], explanation: row[4], sourceEpisode: row[0]
}));

const writingRows = [
  [108, "I had never seen such a beautiful view.", "부정어를 문장 앞으로 옮겨 도치하기", "Never had I seen such a beautiful view.", ["Never I had seen such a beautiful view.", "Never did I had seen such a beautiful view.", "Never had seen I such a beautiful view."], "과거완료의 부정어 도치는 Never + had + 주어 + p.p. 순서예요."],
  [115, "Tom / reads / books", "올바른 S+V+O 문장 만들기", "Tom reads books.", ["Tom books reads.", "Reads Tom books.", "Tom reading books."], "주어 Tom 뒤에 동사 reads, 목적어 books가 와요."],
  [119, "The chef cooked the meal.", "수동태로 바꾸기", "The meal was cooked by the chef.", ["The meal cooked by the chef.", "The meal was cook by the chef.", "The chef was cooked the meal."], "과거 수동태는 was/were + p.p.로 만들어요."],
  [123, "Jina likes jazz. I like jazz, too.", "so 도치를 이용해 한 문장으로 나타내기", "Jina likes jazz, and so do I.", ["Jina likes jazz, and so I do.", "Jina likes jazz, and so am I.", "Jina likes jazz, and neither do I."], "일반동사 현재 긍정문에 동의할 때 so + do + 주어를 써요."],
  [130, "A cat is under the table.", "There is를 사용해 바꾸기", "There is a cat under the table.", ["There are a cat under the table.", "There a cat is under the table.", "It is a cat under the table."], "단수 명사의 존재는 There is + 단수명사로 나타내요."],
  [134, "The window was broken by the boy.", "능동태로 바꾸기", "The boy broke the window.", ["The boy was broken the window.", "The window broke the boy.", "The boy breaked the window."], "수동문의 by 행위자를 주어로 옮기고 과거동사 broke를 써요."],
  [138, "When it is possible, send me the file today.", "접속사절을 생략구문으로 줄이기", "When possible, send me the file today.", ["When being possible, send me the file today.", "When possible is, send me the file today.", "Possible when, send me the file today."], "주절의 상황을 나타내는 be동사절은 접속사와 보어만 남길 수 있어요."],
  [145, "She plays tennis.", "부정문으로 바꾸기", "She does not play tennis.", ["She not plays tennis.", "She does not plays tennis.", "She is not play tennis."], "3인칭 단수 현재 부정문은 does not + 동사원형이에요."],
  [149, "Mina said, “I am tired.”", "간접화법으로 바꾸기", "Mina said that she was tired.", ["Mina said that I am tired.", "Mina told that she was tired.", "Mina said she is tired yesterday."], "과거 시점의 전달에서는 I를 she로, am을 was로 바꿔요."],
  [153, "Because of the rain, we canceled the game.", "무생물주어 문장으로 바꾸기", "The rain caused us to cancel the game.", ["The rain made us canceled the game.", "The rain caused that we cancel the game.", "We were caused to cancel by the rain."], "원인인 the rain을 주어로 두고 cause + 목적어 + to부정사를 쓸 수 있어요."],
  [160, "You like pizza.", "Yes/No 의문문으로 바꾸기", "Do you like pizza?", ["Are you like pizza?", "Does you like pizza?", "You do like pizza?"], "일반동사 현재 의문문은 Do + 주어 + 동사원형 순서예요."],
  [164, "Tom asked me, “Where do you live?”", "간접의문문으로 바꾸기", "Tom asked me where I lived.", ["Tom asked me where did I live.", "Tom asked me where do you live.", "Tom asked where I did live me."], "간접의문문은 의문사 뒤에 주어+동사의 평서문 어순을 써요."],
  [168, "You may choose anything. It will make you happy.", "whatever를 사용해 합치기", "Choose whatever makes you happy.", ["Choose whatever it makes you happy.", "Choose what ever makes happy you.", "Choose whichever does make you happy anything."], "whatever는 ‘무엇이든지’라는 뜻으로 명사절을 이끌어요."],
  [175, "You should open the window.", "명령문으로 바꾸기", "Open the window.", ["You open the window.", "Opening the window.", "To open the window."], "긍정 명령문은 주어를 생략하고 동사원형으로 시작해요."],
  [179, "Dad said to me, “Clean your room.”", "간접화법으로 바꾸기", "Dad told me to clean my room.", ["Dad said me clean my room.", "Dad told that I cleaned my room.", "Dad told me cleaning my room."], "명령문의 간접화법은 tell + 목적어 + to부정사를 써요."],
  [183, "Will she come? I don't know.", "whether를 사용해 합치기", "I don't know whether she will come.", ["I don't know whether will she come.", "I don't know that will she come.", "I don't know whether does she come."], "whether가 이끄는 명사절 안에서는 평서문 어순을 써요."],
  [190, "The flower is very beautiful.", "What 감탄문으로 바꾸기", "What a beautiful flower it is!", ["What beautiful the flower is!", "How a beautiful flower it is!", "What a flower beautiful it is!"], "What 감탄문은 What + a/an + 형용사 + 단수명사 + 주어 + 동사 순서예요."],
  [194, "It is important. We keep promises.", "to부정사를 주어로 하여 합치기", "To keep promises is important.", ["To keeping promises is important.", "Keep promises to be important.", "To keep promises are important."], "to부정사구가 주어로 쓰이면 단수 취급해 is를 써요."],
  [198, "The plan will fail, I think, without more time.", "I think를 삽입하여 자연스럽게 쓰기", "The plan, I think, will fail without more time.", ["The plan I think will, fail without more time.", "I think, the plan, will fail without more time.", "The plan will I think fail, without more time."], "삽입절 I think는 쉼표로 분리해 문장 중간에 넣을 수 있어요."],
  [205, "A cheetah is fast. A horse is not as fast.", "비교급을 사용해 합치기", "A cheetah is faster than a horse.", ["A cheetah is more fast than a horse.", "A cheetah is faster that a horse.", "A cheetah is fastest than a horse."], "fast의 비교급은 faster이고 비교 대상 앞에 than을 써요."],
  [209, "I need a chair. I can sit on it.", "to부정사의 형용사적 용법으로 합치기", "I need a chair to sit on.", ["I need to sit on a chair it.", "I need a chair sitting on.", "I need a chair to sit it on."], "to sit on이 앞의 명사 a chair를 꾸며요."],
  [213, "She is kind. She is also patient.", "not only A but also B로 합치기", "She is not only kind but also patient.", ["She not only is kind and also patient.", "She is not only kind but patient also is.", "She is both kind but also patient."], "not only A but also B에서는 같은 형태의 요소를 병렬로 연결해요."],
  [220, "No other mountain is higher than Everest.", "최상급 문장으로 바꾸기", "Everest is the highest mountain.", ["Everest is a highest mountain.", "Everest is the most high mountain.", "Everest is higher mountain."], "high의 최상급은 the highest예요."],
  [224, "She went to the library because she wanted to study.", "목적의 to부정사로 줄이기", "She went to the library to study.", ["She went to the library for study.", "She went to the library studying to.", "She went to study because the library."], "목적을 나타내는 to부정사는 ‘~하기 위해서’로 해석해요."],
  [228, "Perhaps he forgot the appointment.", "may have p.p.를 사용해 바꾸기", "He may have forgotten the appointment.", ["He may forgot the appointment.", "He may has forgotten the appointment.", "He might have forget the appointment."], "과거에 대한 추측은 may have + p.p.로 나타내요."],
  [235, "I was tired. I finished my homework.", "but으로 연결하기", "I was tired, but I finished my homework.", ["I was tired, so I finished my homework.", "I was tired, or I finished my homework.", "I was tired but, finished I my homework."], "서로 대조되는 내용은 but으로 연결해요."],
  [239, "It is fun to swim in the sea.", "동명사를 주어로 바꾸기", "Swimming in the sea is fun.", ["Swim in the sea is fun.", "Swimming in the sea are fun.", "To swimming in the sea is fun."], "동명사구를 주어로 쓸 때는 단수 취급해 is를 써요."],
  [243, "She seems to finish the work earlier.", "완료부정사로 선행 시점을 나타내기", "She seems to have finished the work earlier.", ["She seems to has finished the work earlier.", "She seemed to have finish the work earlier.", "She seems having finished the work earlier."], "주절보다 앞선 일을 나타낼 때 to have + p.p.를 써요."],
  [250, "The children are playing.", "공원에서라는 전치사구 넣기", "The children are playing in the park.", ["The children are playing at the park in.", "The children in are playing the park.", "The children are playing on the park."], "장소의 내부나 넓은 공간은 in the park로 표현해요."],
  [254, "She enjoys it. She reads novels.", "동명사를 목적어로 하여 합치기", "She enjoys reading novels.", ["She enjoys to read novels.", "She enjoys read novels.", "She enjoying reading novels."], "enjoy 뒤에는 동명사 목적어가 와요."],
  [258, "He denied that he had broken the vase.", "완료동명사를 사용해 바꾸기", "He denied having broken the vase.", ["He denied to have broken the vase.", "He denied having break the vase.", "He denied had broken the vase."], "주절보다 앞선 동명사의 행동은 having + p.p.로 나타내요."],
  [265, "This bicycle belongs to Mina.", "소유격을 사용해 바꾸기", "This is Mina's bicycle.", ["This is bicycle of Mina's.", "This bicycle is Mina.", "This is Minas' bicycle."], "사람 이름 뒤에 's를 붙여 소유를 나타내요."],
  [269, "I visited Jeju twice.", "현재완료 경험으로 바꾸기", "I have visited Jeju twice.", ["I have visit Jeju twice.", "I visited Jeju since twice.", "I am visited Jeju twice."], "지금까지의 경험은 have/has + p.p.로 나타낼 수 있어요."],
  [273, "It is important that he should be honest.", "to부정사의 의미상 주어를 넣어 바꾸기", "It is important for him to be honest.", ["It is important him to be honest.", "It is important of he to be honest.", "It is important for him being honest."], "일반적인 의미상 주어는 for + 목적격으로 나타내요."],
  [280, "The books near me are interesting.", "these를 사용해 바꾸기", "These books are interesting.", ["This books are interesting.", "Those book are interesting.", "These book is interesting."], "가까이 있는 복수 대상을 가리킬 때 these를 써요."],
  [284, "I started living here in 2022, and I still live here.", "현재완료 계속으로 바꾸기", "I have lived here since 2022.", ["I lived here since 2022.", "I have lived here for 2022.", "I am living here since 2022."], "과거부터 지금까지의 계속은 현재완료와 since를 써요."],
  [288, "I didn't study hard then, so I am not confident now.", "혼합가정법으로 바꾸기", "If I had studied hard then, I would be confident now.", ["If I studied hard then, I would have been confident now.", "If I had study hard, I will be confident now.", "If I would have studied, I were confident now."], "과거 사실의 반대가 현재 결과에 영향을 줄 때 if절은 had p.p., 주절은 would + 동사원형을 써요."],
  [295, "Mina reads a book now.", "현재진행형으로 바꾸기", "Mina is reading a book now.", ["Mina reading a book now.", "Mina does reading a book now.", "Mina is read a book now."], "현재진행형은 be동사 + 동사-ing로 만들어요."],
  [299, "She just finished her homework.", "현재완료 완료로 바꾸기", "She has just finished her homework.", ["She just has finish her homework.", "She has just finish her homework.", "She is just finished her homework."], "막 완료된 일은 has/have + just + p.p.로 나타내요."],
  [303, "Not every student passed the test.", "부분부정의 의미가 유지되는 문장 고르기", "Some students did not pass the test.", ["No student passed the test.", "Every student failed the test.", "Students never took the test."], "not every는 ‘모두가 ~한 것은 아니다’라는 부분부정이에요."]
];

const writingQuestions = writingRows.map((row, index) => {
  const answerAt = index % 4;
  const options = [...row[4]];
  options.splice(answerAt, 0, row[3]);
  return { id: `wp-${index + 1}`, originalSentence: row[1], instruction: row[2], options, correctIndex: answerAt, explanation: row[5], sourceEpisode: row[0] };
});

const dialogueRows = [
  [112, "Hi, I'm Jina. Nice to meet you.", "___", "Nice to meet you, too.", ["I'm full.", "Never mind.", "Take care of it."], "처음 만난 사람의 인사에는 Nice to meet you, too.라고 답해요."],
  [116, "Should we take the bus or walk?", "___", "It's up to you.", ["I'm starving.", "Long time no see.", "It rings a bell."], "상대에게 결정을 맡길 때 It's up to you.라고 해요."],
  [120, "Could you tell me why you're contacting us?", "___", "I am writing to inform you that the schedule has changed.", ["What's up with you?", "I'm just looking.", "Let's play it by ear."], "격식 있는 이메일 목적을 밝힐 때 I am writing to inform you that~을 써요."],
  [127, "Hey, Minho! What's up?", "___", "Not much. How about you?", ["You're welcome.", "That's too expensive.", "I couldn't agree more."], "What's up?은 안부를 가볍게 묻는 표현이에요."],
  [131, "I'm sorry I mentioned it.", "___", "Never mind.", ["Break a leg!", "It's on me.", "I'm running late."], "이미 지나간 일을 신경 쓰지 말라는 뜻으로 Never mind.라고 해요."],
  [135, "Can you send the revised file today?", "___", "I would appreciate it if you could give me until tomorrow.", ["Whatever works.", "I'm just looking.", "Long time no see."], "정중하게 부탁할 때 I would appreciate it if~를 사용할 수 있어요."],
  [142, "Would you like some more pasta?", "No, thanks. ___", "I'm full.", ["I'm starving.", "I'm on the fence.", "I'm all ears."], "배가 부르다고 말할 때 I'm full.이라고 해요."],
  [146, "This policy should be changed immediately.", "___", "I couldn't agree more.", ["I couldn't help it.", "Don't mention it.", "It's not my cup."], "상대의 의견에 전적으로 동의할 때 I couldn't agree more.라고 해요."],
  [150, "Do you agree with the director's proposal?", "___", "With all due respect, I have some concerns.", ["What's up?", "Make yourself at home.", "It's on me."], "상대에 대한 존중을 유지하며 반대 의견을 낼 때 With all due respect를 써요."],
  [157, "I have to go now. See you tomorrow!", "___", "Take care!", ["I'm full!", "That's on you!", "Never a mind!"], "헤어질 때 상대의 안녕을 빌며 Take care!라고 할 수 있어요."],
  [161, "Have you heard the name Alex Kim?", "___", "That rings a bell.", ["That breaks a leg.", "That cuts corners.", "That is up to you."], "어렴풋이 기억날 때 That rings a bell.이라고 해요."],
  [165, "What do you think about the new rule?", "___", "It seems to me that it needs more discussion.", ["It is on me that lunch.", "It feels sick to me.", "It goes dutch to me."], "의견을 조심스럽게 제시할 때 It seems to me that~을 써요."],
  [172, "___ I think you dropped your wallet.", "Oh, thank you!", "Excuse me.", ["I'm sorry for you.", "You're welcome me.", "Take care it."], "낯선 사람의 주의를 정중하게 끌 때 Excuse me.라고 해요."],
  [176, "Do you want pizza or noodles?", "___", "I'm on the fence about it.", ["I'm under the weather it.", "I'm on the same page it.", "I'm over the moon it."], "두 선택 사이에서 결정하지 못할 때 on the fence라고 해요."],
  [180, "Why are you exhausted?", "I agreed to lead three projects. ___", "I bit off more than I could chew.", ["I hit the nail on my head.", "I kept it in my hand.", "I went back to my court."], "감당할 수 있는 것보다 많은 일을 맡았을 때 bite off more than you can chew를 써요."],
  [187, "Thanks for carrying these boxes.", "___", "No problem.", ["No question.", "No welcome.", "No luck."], "감사에 가볍게 응답할 때 No problem.이라고 할 수 있어요."],
  [191, "Will the picnic be indoors or outside?", "The weather is uncertain, so ___", "let's play it by ear.", ["let's cut to the chase.", "let's break a leg.", "let's be on the fence."], "상황을 지켜본 뒤 결정하자는 뜻으로 play it by ear를 써요."],
  [195, "I've sent you the final proposal.", "Thanks. Now ___", "the ball is in my court.", ["the bell is in my hand.", "the nail is on my head.", "the tea is in my cup."], "다음 결정이나 행동의 책임이 자신에게 있으면 the ball is in my court라고 해요."],
  [202, "I have my piano audition today.", "___", "Good luck!", ["Get well soon!", "I'm just looking!", "Make yourself at home!"], "시험이나 도전을 앞둔 사람에게 Good luck!이라고 격려해요."],
  [206, "Remember to bring your ID tomorrow.", "Thanks. ___", "I'll keep that in mind.", ["I'll hit that on the head.", "I'll go dutch with that.", "I'll make that at home."], "조언이나 정보를 기억해 두겠다는 뜻으로 keep that in mind를 써요."],
  [210, "We only have five minutes.", "Okay, ___", "let's cut to the chase.", ["let's beat around the bush.", "let's play by the cup.", "let's pull cold feet."], "핵심으로 바로 들어가자는 뜻으로 cut to the chase를 써요."],
  [217, "Can I help you find something?", "No, thanks. ___", "I'm just looking.", ["I'm just starving.", "I'm just agreeing.", "I'm just informing."], "매장에서 둘러보기만 한다고 말할 때 I'm just looking.이라고 해요."],
  [221, "Do you want to watch a horror movie?", "No, thanks. ___", "It's not my cup of tea.", ["It's not on my court.", "It's not my cold feet.", "It's not at my home."], "취향이 아니라고 말할 때 not my cup of tea를 써요."],
  [225, "The prototype failed completely.", "Then we need to ___", "go back to the drawing board.", ["go back to the ball court.", "go back to the tea cup.", "go back to cold feet."], "처음부터 계획을 다시 세울 때 go back to the drawing board라고 해요."],
  [232, "This jacket is $300.", "___", "That's too expensive.", ["That's too starving.", "That's too welcome.", "That's too looking."], "가격이 지나치게 비싸다고 말할 때 That's too expensive.라고 해요."],
  [236, "These boxes are really heavy.", "___", "Let me give you a hand.", ["Let me cut the corners.", "Let me ring a bell.", "Let me go dutch."], "도움을 제안할 때 give you a hand를 써요."],
  [240, "Should we invest all our money in one company?", "No. We shouldn't ___", "put all our eggs in one basket.", ["hit the nail on the head.", "play it by our ear.", "make ourselves at home."], "위험을 한곳에 집중하지 말라는 뜻의 표현이에요."],
  [247, "Are you ready to order?", "Yes. ___", "Can I have the chicken sandwich?", ["Can I be the chicken sandwich?", "Can I do the chicken sandwich?", "Can I take at the chicken sandwich?"], "음식을 주문할 때 Can I have~?를 자연스럽게 사용해요."],
  [251, "How did they finish so quickly?", "They ___ and skipped several safety checks.", "cut corners", ["broke legs", "rang bells", "went dutch"], "시간이나 비용을 아끼려고 필요한 절차를 생략하는 것은 cut corners예요."],
  [255, "Working from home gives freedom but can feel isolating.", "Yes, it's ___", "a blessing and a curse.", ["a bell and a court.", "a cup and a basket.", "a nail and a board."], "좋은 점과 나쁜 점을 동시에 가진 것은 a blessing and a curse라고 해요."],
  [262, "Why are you hurrying?", "___", "I'm running late.", ["I'm going expensive.", "I'm feeling welcome.", "I'm making full."], "약속 시간에 늦고 있다고 말할 때 I'm running late.라고 해요."],
  [266, "The task is unpleasant, but we have to do it.", "I know. Let's ___", "bite the bullet.", ["ring the bell.", "drink the tea.", "draw the board."], "힘들지만 피할 수 없는 일을 감수할 때 bite the bullet이라고 해요."],
  [270, "Another deadline was moved forward.", "Unfortunately, that's ___ in this industry.", "par for the course", ["off the top of my head", "under the tea cup", "over the drawing board"], "어떤 상황에서 흔히 예상되는 일은 par for the course라고 해요."],
  [277, "Let me pay for dinner tonight.", "Really?", "It's on me.", ["It's up me.", "It's by me.", "It's at me."], "내가 비용을 내겠다는 뜻으로 It's on me.라고 해요."],
  [281, "The real problem is unclear communication.", "You ___", "hit the nail on the head.", ["put eggs in a basket.", "got cold feet together.", "went back to tea."], "문제의 핵심을 정확히 짚었을 때 hit the nail on the head라고 해요."],
  [285, "How many people attended?", "___, I'd say about fifty.", "Off the top of my head", ["Under the bottom of my foot", "Inside the cup of my tea", "Across the board of my room"], "정확히 확인하지 않고 바로 떠오르는 대로 답할 때 쓰는 표현이에요."],
  [292, "How should we split the bill?", "___", "Let's go dutch.", ["Let's get well.", "Let's feel free.", "Let's run late."], "각자 먹은 비용을 따로 내자는 뜻으로 go dutch라고 해요."],
  [296, "Please tell me directly what happened.", "Okay. I won't ___", "beat around the bush.", ["hit the nail on the head.", "go the extra mile.", "pull myself together."], "핵심을 피하며 빙빙 돌려 말하는 것은 beat around the bush예요."],
  [300, "The usual solutions aren't working.", "Then we need to ___", "think outside the box.", ["put everything in one box.", "return to the same box.", "cut the box corners."], "기존 틀을 벗어나 창의적으로 생각할 때 think outside the box라고 해요."],
  [307, "You don't look well today.", "___", "I have a cold.", ["I have a luck.", "I have a welcome.", "I have a late."], "감기에 걸렸다고 말할 때 I have a cold.라고 해요."]
];

const dialogueQuestions = dialogueRows.map((row, index) => {
  const answerAt = index % 4;
  const options = [...row[4]];
  options.splice(answerAt, 0, row[3]);
  return {
    id: `ex-${index + 1}`,
    dialogue: [{ speaker: "A", text: row[1] }, { speaker: "B", text: row[2] }],
    options, correctIndex: answerAt, explanation: row[5], sourceEpisode: row[0]
  };
});

const grammarRows = [
  [109, "Choose the correct sentence.", ["Her helped I.", "She helped me.", "Me helped she.", "She helped I."], 1, "주어 자리에는 She, 목적어 자리에는 me를 써요."],
  [113, "I ___ this book last year.", ["have read", "read", "have been reading", "am reading"], 1, "명확한 과거 시점 last year가 있으므로 과거시제를 써요."],
  [117, "This is the town ___ I was born.", ["which", "where", "what", "that place"], 1, "뒤 절이 완전하고 장소를 선행사로 하므로 관계부사 where가 맞아요."],
  [124, "The students ___ in the classroom.", ["is", "are", "am", "be"], 1, "복수 주어 The students에는 are를 써요."],
  [128, "The bridge ___ in 2010.", ["built", "was built", "was build", "is building"], 1, "과거에 건설된 것이므로 과거 수동태 was built가 맞아요."],
  [132, "She not only sings well but also ___ beautifully.", ["to dance", "dances", "dancing", "dance was"], 1, "sings와 병렬을 이루도록 3인칭 단수 현재형 dances를 써요."],
  [139, "My brother ___ soccer every Sunday.", ["play", "plays", "playing", "is play"], 1, "3인칭 단수 현재 주어에는 동사에 -s를 붙여요."],
  [143, "She enjoys ___ mystery novels.", ["to read", "reading", "read", "to reading"], 1, "enjoy는 목적어로 동명사를 취해요."],
  [147, "The book ___ in simple English is easy to understand.", ["writing", "written", "wrote", "is writing"], 1, "책은 쓰이는 대상이므로 과거분사 written이 맞아요."],
  [154, "Yesterday, he ___ a new backpack.", ["buyed", "bought", "buys", "has buy"], 1, "buy의 불규칙 과거형은 bought예요."],
  [158, "The lecture was so ___ that everyone took notes.", ["interested", "interesting", "interest", "interestingly lecture"], 1, "강의가 흥미를 유발하므로 현재분사형 interesting을 써요."],
  [162, "___ the door, Mina walked into the room.", ["Opening", "Opened", "Was opening", "To opened"], 0, "Mina가 문을 여는 능동 관계이므로 Opening이 맞아요."],
  [169, "He ___ like spicy food.", ["don't", "doesn't", "isn't", "didn't likes"], 1, "3인칭 단수 현재 부정문은 doesn't + 동사원형이에요."],
  [173, "The phone ___ I bought yesterday is already broken.", ["what", "that", "where", "who"], 1, "사물 선행사를 받고 목적어가 빠진 절을 이끄는 that이 맞아요."],
  [177, "Only then ___ the truth.", ["I understood", "did I understand", "I did understood", "understood I"], 1, "Only + 부사구가 문두에 오면 조동사와 주어가 도치돼요."],
  [184, "___ she know the answer?", ["Do", "Does", "Is", "Did knows"], 1, "3인칭 단수 현재 일반동사 의문문은 Does로 시작해요."],
  [188, "The café ___ we met has closed.", ["which", "where", "what", "that it"], 1, "만난 장소를 나타내고 뒤 절이 완전하므로 where를 써요."],
  [192, "It was Tom ___ broke the window.", ["which", "who", "where", "whom he"], 1, "사람 Tom을 강조하고 뒤에서 주어 역할을 하므로 who가 맞아요."],
  [199, "She ate ___ apple after lunch.", ["a", "an", "the one", "some"], 1, "apple은 모음 소리로 시작하는 단수 가산명사이므로 an을 써요."],
  [203, "The game was canceled ___ the heavy rain.", ["because", "because of", "although", "despite of"], 1, "명사구 the heavy rain 앞에는 because of가 와요."],
  [207, "The quality of these products ___ excellent.", ["are", "is", "have", "being"], 1, "주어의 핵심은 단수명사 quality이므로 is를 써요."],
  [214, "Three ___ were playing in the yard.", ["childs", "children", "childrens", "childes"], 1, "child의 불규칙 복수형은 children이에요."],
  [218, "If I ___ you, I would apologize.", ["am", "were", "was been", "will be"], 1, "현재 사실과 반대되는 가정법 과거에서 be동사는 were를 써요."],
  [222, "I don't know ___.", ["where is he", "where he is", "where does he live", "where he does is"], 1, "명사절인 간접의문문은 의문사 + 주어 + 동사 어순이에요."],
  [229, "There isn't ___ milk in the fridge.", ["some", "any", "many", "a few"], 1, "일반적인 부정문에는 any를 써요."],
  [233, "Jina said that she ___ busy the next day.", ["is", "would be", "will", "has been tomorrow"], 1, "과거 시점의 전달에서 will은 would로 바뀌어요."],
  [237, "Could you tell me ___?", ["what time does it start", "what time it starts", "does it start what time", "what time starts it"], 1, "간접의문문 안에서는 주어 + 동사의 평서문 어순을 써요."],
  [244, "___ shoes over there are mine.", ["This", "Those", "That", "These one"], 1, "멀리 있는 복수명사 shoes를 가리킬 때 Those를 써요."],
  [248, "The teacher made us ___ the paragraph again.", ["to write", "write", "writing", "wrote"], 1, "능동태의 사역동사 make 뒤 목적격보어에는 동사원형이 와요."],
  [252, "Take ___ you need from the box.", ["that", "whatever", "which it", "what thing that"], 1, "선행사를 포함해 ‘필요한 것은 무엇이든’이라는 뜻으로 whatever를 써요."],
  [259, "She answered the question ___.", ["correct", "correctly", "correction", "more correct answer"], 1, "동사 answered를 꾸미는 부사 correctly가 필요해요."],
  [263, "I heard someone ___ my name.", ["called", "call", "to calling", "was call"], 1, "지각동사 heard 뒤 목적격보어로 동사원형을 쓸 수 있어요."],
  [267, "Not all birds can fly means ___.", ["No birds can fly.", "Some birds cannot fly.", "All birds cannot fly.", "Birds never fly."], 1, "not all은 ‘모두가 그런 것은 아니다’라는 부분부정이에요."],
  [274, "Choose the natural word order.", ["She goes always to school early.", "She always goes to school early.", "Always she to school goes early.", "She goes to always school early."], 1, "일반동사 문장에서 빈도부사는 보통 일반동사 앞에 와요."],
  [278, "This soup tastes ___.", ["well", "good", "deliciously taste", "nicely flavor"], 1, "감각동사 tastes 뒤에는 주어의 상태를 설명하는 형용사 good이 와요."],
  [282, "The heavy snow ___ us from leaving home.", ["prevented to", "prevented", "made to", "let from"], 1, "prevent + 목적어 + from -ing 구조에서 prevented us from leaving이 맞아요."],
  [289, "The meeting starts ___ 3 p.m.", ["in", "at", "on", "by on"], 1, "정확한 시각 앞에는 전치사 at을 써요."],
  [293, "This bag is ___ that one.", ["twice as expensive than", "twice as expensive as", "two times expensive as", "twice more expensive as"], 1, "배수 비교는 배수사 + as + 원급 + as 구조를 써요."],
  [297, "He looks exhausted. He ___ all night.", ["must work", "must have worked", "should worked", "can have work"], 1, "과거 일에 대한 강한 추측은 must have + p.p.로 나타내요."],
  [304, "I wanted to go, ___ I was too tired.", ["and", "but", "or", "so that"], 1, "서로 대조되는 내용을 연결할 때 but을 써요."]
];

const grammarQuestions = grammarRows.map((row, index) => ({
  id: `gt-${index + 1}`,
  prompt: row[1], options: row[2], correctIndex: row[3], explanation: row[4], sourceEpisode: row[0]
}));

const categoryConfig = [
  { slug: "구동사", prefix: "pv", type: "multiple-choice", questions: phrasalQuestions },
  { slug: "오답노트", prefix: "cn", type: "multiple-choice", questions: confusionQuestions },
  { slug: "영작패턴", prefix: "wp", type: "sentence-transform", questions: writingQuestions },
  { slug: "관용표현", prefix: "ex", type: "dialogue-completion", questions: dialogueQuestions },
  { slug: "수능어법유형", prefix: "gt", type: "multiple-choice", questions: grammarQuestions }
];

const setDescriptions = {
  "구동사": ["일상 동작·발견·변화를 나타내는 구동사", "조사·계획·돌봄을 나타내는 구동사", "실행·회상·포기를 나타내는 구동사", "이동·취소·평가를 나타내는 구동사"],
  "오답노트": ["철자와 품사가 헷갈리는 표현", "전치사·동사 선택에서 틀리기 쉬운 표현", "뜻이 비슷해 혼동되는 어휘", "수량·관계 표현의 미세한 차이"],
  "영작패턴": ["기본 문장 전환과 도치·수동태", "의문문·화법·명사절 문장 전환", "비교·준동사·병렬구조 문장 전환", "완료·가정법·부분부정 문장 전환"],
  "관용표현": ["인사·안부·의견 표현", "사과·선택·격려 표현", "쇼핑·주문·도움 요청 표현", "결정·비용·문제 해결 표현"],
  "수능어법유형": ["대명사·시제·수 일치 핵심 어법", "준동사·관계사·도치 핵심 어법", "가정법·화법·간접의문문 핵심 어법", "형용사·부사·비교·조동사 핵심 어법"]
};

const examSets = {};

for (const category of categoryConfig) {
  const directory = path.join(root, "lib", "exams", category.slug);
  fs.mkdirSync(directory, { recursive: true });

  for (let setIndex = 0; setIndex < 4; setIndex += 1) {
    const setNumber = setIndex + 1;
    const examId = `${category.slug}-set-${String(setNumber).padStart(2, "0")}`;
    const questions = category.questions.slice(setIndex * 10, setIndex * 10 + 10);
    const fileName = `set-${String(setNumber).padStart(2, "0")}.json`;

    fs.writeFileSync(path.join(directory, fileName), `${JSON.stringify(questions, null, 2)}\n`);
    examSets[examId] = {
      examId,
      setNumber,
      title: `SET ${String(setNumber).padStart(2, "0")}`,
      description: setDescriptions[category.slug][setIndex],
      seriesSlug: category.slug,
      level: "Mixed",
      examType: category.type,
      questionCount: questions.length,
      sourceEpisodes: questions.map((question) => question.sourceEpisode),
      questionFile: `exams/${category.slug}/${fileName}`,
      status: "published"
    };
  }
}

fs.writeFileSync(path.join(root, "lib", "examSets.json"), `${JSON.stringify(examSets, null, 2)}\n`);
console.log(`Generated ${Object.keys(examSets).length} sets and ${categoryConfig.reduce((sum, category) => sum + category.questions.length, 0)} questions.`);
