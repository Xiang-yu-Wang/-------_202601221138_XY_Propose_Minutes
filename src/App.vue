<script setup>
import { ref } from 'vue';
import { 
  Menu, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Truck, 
  MousePointerClick, 
  Gift, 
  HelpCircle, 
  MapPin, 
  Phone, 
  MessageCircle,
  ArrowRight,
  Box,
  CreditCard,
  Clock
} from 'lucide-vue-next';

// --- State Management ---
const isMenuOpen = ref(false);

// --- Methods ---
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen.value = false; // 點擊後關閉手機選單
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800">
    <nav class="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2 cursor-pointer" @click="scrollToTop">
            <Truck class="h-8 w-8 text-blue-700" />
            <span class="text-xl font-bold text-slate-900">大倉代領</span>
          </div>
          
          <div class="hidden md:flex items-center gap-8">
            <button @click="scrollToSection('pain-points')" class="text-slate-600 hover:text-blue-700 font-medium">為什麼選擇我們</button>
            <button @click="scrollToSection('plans')" class="text-slate-600 hover:text-blue-700 font-medium">服務方案</button>
            <button @click="scrollToSection('process')" class="text-slate-600 hover:text-blue-700 font-medium">領取流程</button>
            <button @click="scrollToSection('gallery')" class="text-slate-600 hover:text-blue-700 font-medium">熱門清單</button>
            <button @click="scrollToSection('faq')" class="text-slate-600 hover:text-blue-700 font-medium">常見問題</button>
            <a 
              href="https://line.me/ti/p/~@792nvftc" 
              target="_blank" 
              rel="noreferrer"
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2"
            >
              <MessageCircle :size="18" />
              加入 LINE
            </a>
          </div>

          <div class="md:hidden">
            <button @click="toggleMenu" class="text-slate-600">
              <component :is="isMenuOpen ? X : Menu" :size="28" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-slate-100 absolute w-full">
        <div class="flex flex-col p-4 gap-4">
          <button @click="scrollToSection('pain-points')" class="text-left font-medium text-slate-600">為什麼選擇我們</button>
          <button @click="scrollToSection('plans')" class="text-left font-medium text-slate-600">服務方案</button>
          <button @click="scrollToSection('process')" class="text-left font-medium text-slate-600">領取流程</button>
          <button @click="scrollToSection('gallery')" class="text-left font-medium text-slate-600">熱門清單</button>
          <button @click="scrollToSection('faq')" class="text-left font-medium text-slate-600">常見問題</button>
          <a 
            href="https://line.me/ti/p/~@792nvftc" 
            class="bg-green-500 text-white px-4 py-3 rounded-lg font-bold text-center flex justify-center items-center gap-2"
          >
            <MessageCircle :size="20" />
            立即加入 LINE 諮詢
          </a>
        </div>
      </div>
    </nav>

    <section class="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="container mx-auto px-4 md:px-6 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-6 animate-pulse">
            2025 股東會紀念品攻略
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            一股全餐，一鍵買齊<br />
            <span class="text-blue-300">把生活用品搬回家</span>
          </h1>
          <p class="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
            還在煩惱上班沒空領紀念品？擔心買零股手續繁雜？<br />
            大倉代領提供專業倉儲、自動化模組與代領服務，讓您輕鬆對抗通膨，省下生活開支。
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://line.me/ti/p/~@792nvftc" 
              class="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2"
            >
              索取全餐模組 <ArrowRight :size="20" />
            </a>
            <button 
              @click="scrollToSection('plans')"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-lg px-8 py-4 rounded-lg font-bold transition-all"
            >
              查看代領方案
            </button>
          </div>
          <p class="mt-6 text-sm text-slate-400">
            *已有超過 870 檔高機率發放公司模組，隨時更新
          </p>
        </div>
      </div>
    </section>

    <section id="pain-points" class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4 md:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">為什麼你需要大倉代領？</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">
            投資零股領紀念品是小資族的確幸，但過程往往充滿阻礙。我們為您解決所有痛點。
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group">
            <div class="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock class="text-red-600" :size="28" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">上班沒空排隊</h3>
            <p class="text-slate-600 mb-4">
              股東會通常在平日，為了領一個紀念品請假扣薪划不來？還要跑遍各大股務代理點？
            </p>
            <div class="flex items-center gap-2 text-blue-700 font-medium">
              <CheckCircle :size="18" />
              <span>大倉幫您全台跑透透</span>
            </div>
          </div>

          <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group">
            <div class="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertTriangle class="text-orange-600" :size="28" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">手動下單風險高</h3>
            <p class="text-slate-600 mb-4">
              想買幾百檔零股，一筆一筆按到手軟？還可能發生「肥手指」按成整張股票的慘劇？
            </p>
            <div class="flex items-center gap-2 text-blue-700 font-medium">
              <CheckCircle :size="18" />
              <span>提供一鍵匯入自動模組</span>
            </div>
          </div>

          <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all group">
            <div class="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Box class="text-blue-600" :size="28" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-slate-900">家裡堆滿雜物</h3>
            <p class="text-slate-600 mb-4">
              領了一堆用不到的紀念品佔空間？租屋族空間有限，只想領實用的超商卡？
            </p>
            <div class="flex items-center gap-2 text-blue-700 font-medium">
              <CheckCircle :size="18" />
              <span>提供純領超商卡方案</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="plans" class="py-16 md:py-24 bg-slate-100">
      <div class="container mx-auto px-4 md:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">量身打造的代領方案</h2>
          <p class="text-slate-600">無論您是想要生活用品全餐，還是只想領取超商卡，我們都有適合的方案。</p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 flex flex-col">
            <div class="mb-4">
              <span class="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-bold">彈性選擇</span>
            </div>
            <h3 class="text-2xl font-bold mb-2">散單代領</h3>
            <p class="text-slate-500 mb-6">適合只想領取特定幾家公司紀念品的股東。</p>
            <div class="space-y-4 mb-8 flex-grow">
              <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                <span class="text-slate-600">價值 $35 以下</span>
                <span class="font-bold text-slate-900">收 $10 / 件</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                <span class="text-slate-600">其餘一般物品</span>
                <span class="font-bold text-slate-900">收 $20 / 件</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-2">
                <span class="text-slate-600">價值 $100 以上</span>
                <span class="font-bold text-slate-900">收 $30 / 件</span>
              </div>
              <p class="text-xs text-slate-400 mt-2">*大型或熱門物品視情況加收費用</p>
            </div>
            <a href="https://line.me/ti/p/~@792nvftc" class="w-full block text-center bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold transition-colors">
              諮詢散單
            </a>
          </div>

          <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600 relative transform md:-translate-y-4 flex flex-col">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span class="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">最受歡迎</span>
            </div>
            <h3 class="text-2xl font-bold mb-2 text-blue-800">一股全餐代領</h3>
            <p class="text-slate-500 mb-6">實物均分 + 超商卡抵扣。適合家庭、想省生活費的您。</p>
            <div class="space-y-4 mb-8 flex-grow">
              <div class="flex items-start gap-3">
                <CheckCircle class="text-green-500 flex-shrink-0 mt-1" :size="20" />
                <p class="text-slate-700"><strong>免收代領費</strong>：以超商卡/現金流卡變現抵扣費用。</p>
              </div>
              <div class="flex items-start gap-3">
                <CheckCircle class="text-green-500 flex-shrink-0 mt-1" :size="20" />
                <p class="text-slate-700"><strong>實物均分</strong>：生活用品、食品、清潔用品裝箱宅配。</p>
              </div>
              <div class="flex items-start gap-3">
                <CheckCircle class="text-green-500 flex-shrink-0 mt-1" :size="20" />
                <p class="text-slate-700"><strong>免費宅配</strong>：每年免費送貨到府，省時省力。</p>
              </div>
              <div class="flex items-start gap-3">
                <CheckCircle class="text-green-500 flex-shrink-0 mt-1" :size="20" />
                <p class="text-slate-700"><strong>自動化模組</strong>：提供 870+ 檔高機率發放名單。</p>
              </div>
            </div>
            <a href="https://line.me/ti/p/~@792nvftc" class="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold transition-colors shadow-lg shadow-blue-200">
              加入全餐計畫
            </a>
          </div>

          <div class="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 flex flex-col">
            <div class="mb-4">
              <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">租屋族首選</span>
            </div>
            <h3 class="text-2xl font-bold mb-2">純領超商卡</h3>
            <p class="text-slate-500 mb-6">空間有限？我們幫您過濾實體物品，只領高變現票券。</p>
            <div class="space-y-4 mb-8 flex-grow">
              <div class="flex items-start gap-3">
                <Gift class="text-blue-500 flex-shrink-0 mt-1" :size="20" />
                <p class="text-slate-700"><strong>只分超商卡</strong>：7-11、全家商品卡為主。</p>
              </div>
              <div class="flex items-start gap-3">
                <Gift class="text-blue-500 flex-shrink-0 mt-1" :size="20" />
                <p class="text-slate-700"><strong>不佔空間</strong>：無需處理鍋碗瓢盆等實體雜物。</p>
              </div>
              <div class="flex items-start gap-3">
                <Gift class="text-blue-500 flex-shrink-0 mt-1" :size="20" />
                <p class="text-slate-700"><strong>審核機制</strong>：需視當年各倉庫容量審核人數。</p>
              </div>
            </div>
            <a href="https://line.me/ti/p/~@792nvftc" class="w-full block text-center bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold transition-colors">
              諮詢小資方案
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="process" class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4 md:px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">簡單四步驟，輕鬆領好禮</h2>
          <p class="text-slate-600">不用懂複雜的股市操作，跟著我們的教學與模組即可完成。</p>
        </div>

        <div class="grid md:grid-cols-4 gap-8 relative">
          <div class="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

          <div class="bg-white p-6 text-center">
            <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
              <CreditCard class="text-blue-600" :size="40" />
            </div>
            <h3 class="text-xl font-bold mb-2">1. 開立證券戶</h3>
            <p class="text-slate-500 text-sm">
              推薦使用<strong>國票、國泰、群益</strong>證券，支援我們的自動化匯入模組。建議新開一戶專門操作零股。
            </p>
          </div>

          <div class="bg-white p-6 text-center">
            <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
              <MousePointerClick class="text-blue-600" :size="40" />
            </div>
            <h3 class="text-xl font-bold mb-2">2. 匯入模組買進</h3>
            <p class="text-slate-500 text-sm">
              加入 LINE 索取 XML 模組，一鍵匯入 800+ 檔股票。避免手動輸入錯誤，安全又快速。
            </p>
          </div>

          <div class="bg-white p-6 text-center">
            <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
              <CheckCircle class="text-blue-600" :size="40" />
            </div>
            <h3 class="text-xl font-bold mb-2">3. 電子投票</h3>
            <p class="text-slate-500 text-sm">
              使用「零股爽」或集保 e 手機 APP 進行電子投票。設定大倉為代領人，我們幫您跑腿。
            </p>
          </div>

          <div class="bg-white p-6 text-center">
            <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
              <Truck class="text-blue-600" :size="40" />
            </div>
            <h3 class="text-xl font-bold mb-2">4. 坐等收貨</h3>
            <p class="text-slate-500 text-sm">
              我們會將紀念品整理、裝箱，並依照您的方案配送到府。享受拆禮物的驚喜！
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="gallery" class="py-16 md:py-24 bg-slate-900 text-white">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col md:flex-row gap-12 items-center">
          <div class="md:w-1/2">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">實力見證，值得信賴</h2>
            <p class="text-slate-300 mb-6 text-lg">
              大倉代領擁有豐富的倉儲管理經驗與物流配送能力。每年處理數萬件股東紀念品，是您最可靠的合作夥伴。
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3">
                <MapPin class="text-red-500" />
                <span><strong>實體倉庫：</strong>新北市板橋區民治街 71 巷 58 號</span>
              </li>
              <li class="flex items-center gap-3">
                <Box class="text-red-500" />
                <span><strong>專業倉儲：</strong>分類清楚，保存良好，確保物品完整</span>
              </li>
              <li class="flex items-center gap-3">
                <Truck class="text-red-500" />
                <span><strong>全台服務：</strong>無論您住哪裡，我們都能協助代領與配送</span>
              </li>
            </ul>
            <a href="https://line.me/ti/p/~@792nvftc" class="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
              預約參觀 / 諮詢
            </a>
          </div>
          
          <div class="md:w-1/2">
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <Gift class="text-yellow-400" :size="24" />
                2025 熱門紀念品預覽
              </h3>
              <p class="text-slate-400 text-sm mb-4">根據過往經驗與模組數據，精選高CP值好禮：</p>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="bg-blue-600 text-xs font-bold px-2 py-1 rounded">1101 台泥</span>
                    <span>分隔便當盒</span>
                  </div>
                  <span class="text-slate-400 text-sm">實用好物</span>
                </div>

                <div class="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="bg-blue-600 text-xs font-bold px-2 py-1 rounded">1210 大成</span>
                    <span>150元 抵用券</span>
                  </div>
                  <span class="text-yellow-400 text-sm font-bold">高價值</span>
                </div>

                <div class="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="bg-blue-600 text-xs font-bold px-2 py-1 rounded">1103 嘉泥</span>
                    <span>Jack wolfskin 護膝</span>
                  </div>
                  <span class="text-slate-400 text-sm">品牌聯名</span>
                </div>

                <div class="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="bg-blue-600 text-xs font-bold px-2 py-1 rounded">8299 群聯</span>
                    <span>全家 50元 禮物卡</span>
                  </div>
                  <span class="text-green-400 text-sm">超商卡</span>
                </div>

                <div class="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="bg-blue-600 text-xs font-bold px-2 py-1 rounded">1201 味全</span>
                    <span>貝納頌咖啡</span>
                  </div>
                  <span class="text-slate-400 text-sm">食品</span>
                </div>
              </div>

              <div class="mt-4 text-center">
                <p class="text-xs text-slate-500">* 以上僅為參考範例，實際發放以當年公司公告為準</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="py-16 md:py-24 bg-slate-50">
      <div class="container mx-auto px-4 md:px-6 max-w-4xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">常見問題</h2>
          <p class="text-slate-600">新手入門必看，解答您對零股代領的疑惑。</p>
        </div>

        <div class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold mb-2 flex items-center gap-2">
              <HelpCircle class="text-blue-600" :size="20" />
              什麼時候要買進股票？
            </h3>
            <p class="text-slate-600">
              必須在「最後過戶日」前買進。公式為：股東會召開前 60 日 + T+2 交割日。簡單來說，建議在<strong>股東會前 62 天</strong>買進。通常二月初就可以開始佈局了！
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold mb-2 flex items-center gap-2">
              <HelpCircle class="text-blue-600" :size="20" />
              買一股要多少錢？手續費貴嗎？
            </h3>
            <p class="text-slate-600">
              大部分零股一股約 10-20 元，全額交割股甚至低於 10 元。許多券商（如國泰、國票）零股手續費最低僅需 1 元。
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold mb-2 flex items-center gap-2">
              <HelpCircle class="text-blue-600" :size="20" />
              什麼是全額交割股？要注意什麼？
            </h3>
            <p class="text-slate-600">
              全額交割股或警示股，交易前需要先「圈存」（預收款項）。建議交易日開盤前（7:30-8:59）先圈存約 2000 元，才能順利買到數十檔此類股票。
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold mb-2 flex items-center gap-2">
              <HelpCircle class="text-blue-600" :size="20" />
              除了紀念品，還有股利嗎？
            </h3>
            <p class="text-slate-600">
              有的人！870 檔股票平均每股約 2-3 元股利，每年約可領 1700-2600 元現金股利。雖然金額不大，但也是額外的收入。
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Truck class="h-8 w-8 text-blue-500" />
              <span class="text-2xl font-bold">大倉代領</span>
            </div>
            <p class="text-slate-400 max-w-md">
              專業股東會紀念品代領、倉儲、配送服務。<br />
              讓您的一股發揮最大價值，生活用品領不完。
            </p>
          </div>

          <div class="flex flex-col gap-4 w-full md:w-auto">
            <div class="flex items-center gap-3 bg-slate-800 px-6 py-4 rounded-lg">
              <Phone class="text-green-400" />
              <div>
                <p class="text-xs text-slate-400">聯絡電話 (贊哥)</p>
                <p class="font-bold text-lg">0982-571-134</p>
              </div>
            </div>
            <div class="flex items-center gap-3 bg-slate-800 px-6 py-4 rounded-lg">
              <MessageCircle class="text-green-400" />
              <div>
                <p class="text-xs text-slate-400">LINE ID</p>
                <p class="font-bold text-lg">@792nvftc</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; 2025 大倉代領. All rights reserved. | 投資一定有風險，申購前請詳閱公開說明書。</p>
        </div>
      </div>
    </footer>
  </div>
</template>