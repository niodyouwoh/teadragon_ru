export interface Product {
  id: string
  name: string
  nameZh: string
  category: string
  price: number
  oldPrice?: number
  weight: string
  description: string
  origin: string
  year?: number
  image: string
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
}

export const categories = [
  { id: "all", name: "Все товары", nameZh: "所有产品" },
  { id: "puer", name: "Пуэр", nameZh: "普洱茶" },
  { id: "oolong", name: "Улун", nameZh: "乌龙茶" },
  { id: "green", name: "Зелёный чай", nameZh: "绿茶" },
  { id: "white", name: "Белый чай", nameZh: "白茶" },
  { id: "red", name: "Красный чай", nameZh: "红茶" },
  { id: "teaware", name: "Посуда", nameZh: "茶具" },
]

export const products: Product[] = [
  // Пуэр
  {
    id: "puer-1",
    name: "Шу Пуэр «Старые деревья»",
    nameZh: "老树熟普洱",
    category: "puer",
    price: 1450,
    weight: "100 г",
    description:
      "Выдержанный шу пуэр с древних деревьев провинции Юньнань. Глубокий землистый вкус с нотами чернослива и тёмного шоколада.",
    origin: "Юньнань, Китай",
    year: 2019,
    image: "/dark-compressed-pu-erh-tea-cake-on-bamboo-mat.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "puer-2",
    name: "Шэн Пуэр «Булан Шань»",
    nameZh: "布朗山生普洱",
    category: "puer",
    price: 2200,
    weight: "100 г",
    description:
      "Молодой шэн пуэр с горы Булан. Яркий, слегка терпкий вкус с цветочными нотами и долгим сладким послевкусием.",
    origin: "Юньнань, Китай",
    year: 2022,
    image: "/raw-green-pu-erh-tea-cake-traditional.jpg",
    inStock: true,
    isNew: true,
  },
  {
    id: "puer-3",
    name: "Шу Пуэр «Лао Ча Тоу»",
    nameZh: "老茶头",
    category: "puer",
    price: 1800,
    weight: "100 г",
    description:
      "Старые чайные головы — естественно слипшиеся комочки листа. Плотный, сладкий вкус с ореховыми нотами.",
    origin: "Юньнань, Китай",
    year: 2018,
    image: "/pu-erh-tea-nuggets-lao-cha-tou.jpg",
    inStock: true,
  },

  // Улун
  {
    id: "oolong-1",
    name: "Тегуаньинь «Весенний сбор»",
    nameZh: "铁观音",
    category: "oolong",
    price: 1350,
    weight: "50 г",
    description:
      "Классический улун из провинции Фуцзянь. Цветочный аромат орхидеи, сладкий вкус с нотами мёда и лёгкой кислинкой.",
    origin: "Фуцзянь, Китай",
    image: "/tieguanyin-oolong-tea-leaves-green.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "oolong-2",
    name: "Да Хун Пао «Большой красный халат»",
    nameZh: "大红袍",
    category: "oolong",
    price: 2800,
    weight: "50 г",
    description:
      "Легендарный утёсный улун с гор Уи. Минеральный характер, карамельная сладость и долгое согревающее послевкусие.",
    origin: "Фуцзянь, Китай",
    image: "/da-hong-pao-oolong-tea-dark-roasted.jpg",
    inStock: true,
  },
  {
    id: "oolong-3",
    name: "Алишань Цзинь Сюань",
    nameZh: "阿里山金萱",
    category: "oolong",
    price: 1600,
    weight: "50 г",
    description:
      "Высокогорный тайваньский улун с нежным молочным оттенком. Деликатный, сливочный вкус с цветочными нотами.",
    origin: "Тайвань",
    image: "/alishan-jin-xuan-oolong-tea-taiwanese.jpg",
    inStock: true,
    isNew: true,
  },

  // Зелёный чай
  {
    id: "green-1",
    name: "Лунцзин «Колодец дракона»",
    nameZh: "龙井",
    category: "green",
    price: 1900,
    weight: "50 г",
    description: "Знаменитый зелёный чай из Ханчжоу. Плоские листья, свежий вкус с нотами каштана и лёгкой сладостью.",
    origin: "Чжэцзян, Китай",
    image: "/longjing-dragonwell-green-tea-flat-leaves.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "green-2",
    name: "Билочунь «Изумрудные спирали весны»",
    nameZh: "碧螺春",
    category: "green",
    price: 1700,
    weight: "50 г",
    description: "Нежный зелёный чай в форме спиралей. Фруктовый аромат с нотами абрикоса и освежающий вкус.",
    origin: "Цзянсу, Китай",
    image: "/biluochun-green-tea-spiral-leaves.jpg",
    inStock: true,
  },
  {
    id: "green-3",
    name: "Тайпин Хоукуй",
    nameZh: "太平猴魁",
    category: "green",
    price: 2400,
    weight: "50 г",
    description:
      "Редкий зелёный чай с необычно крупными листьями. Орхидеевый аромат, мягкий вкус с нотами свежей зелени.",
    origin: "Аньхой, Китай",
    image: "/taiping-houkui-large-flat-green-tea-leaves.jpg",
    inStock: true,
  },

  // Белый чай
  {
    id: "white-1",
    name: "Бай Хао Инь Чжэнь «Серебряные иглы»",
    nameZh: "白毫银针",
    category: "white",
    price: 2600,
    weight: "50 г",
    description: "Премиальный белый чай из почек, покрытых серебристым пухом. Тонкий медовый вкус с цветочными нотами.",
    origin: "Фуцзянь, Китай",
    image: "/bai-hao-yin-zhen-silver-needle-white-tea.jpg",
    inStock: true,
  },
  {
    id: "white-2",
    name: "Бай Му Дань «Белый пион»",
    nameZh: "白牡丹",
    category: "white",
    price: 1400,
    weight: "50 г",
    description: "Классический белый чай из почек и молодых листьев. Свежий, сладкий вкус с нотами дыни и сена.",
    origin: "Фуцзянь, Китай",
    image: "/bai-mu-dan-white-peony-tea-leaves.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "white-3",
    name: "Шоу Мэй «Брови старца»",
    nameZh: "寿眉",
    category: "white",
    price: 950,
    weight: "50 г",
    description: "Выдержанный белый чай из зрелых листьев. Насыщенный, сладкий вкус с древесными нотами.",
    origin: "Фуцзянь, Китай",
    year: 2020,
    image: "/shou-mei-aged-white-tea-leaves.jpg",
    inStock: true,
  },

  // Красный чай
  {
    id: "red-1",
    name: "Цзинь Цзюнь Мэй «Золотые брови»",
    nameZh: "金骏眉",
    category: "red",
    price: 3200,
    weight: "50 г",
    description: "Элитный красный чай из молодых почек. Медовый аромат, сладкий вкус с нотами кураги и шоколада.",
    origin: "Фуцзянь, Китай",
    image: "/jin-jun-mei-golden-eyebrow-red-tea.jpg",
    inStock: true,
  },
  {
    id: "red-2",
    name: "Дянь Хун «Юньнаньский красный»",
    nameZh: "滇红",
    category: "red",
    price: 1100,
    weight: "50 г",
    description:
      "Классический юньнаньский красный чай с золотистыми типсами. Мягкий, медовый вкус с фруктовыми нотами.",
    origin: "Юньнань, Китай",
    image: "/dianhong-yunnan-red-tea-golden-tips.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "red-3",
    name: "Чжэн Шань Сяо Чжун «Лапсанг Сушонг»",
    nameZh: "正山小种",
    category: "red",
    price: 1500,
    weight: "50 г",
    description: "Традиционный копчёный красный чай. Дымный аромат, насыщенный вкус с нотами сосны и сухофруктов.",
    origin: "Фуцзянь, Китай",
    image: "/lapsang-souchong-smoked-black-tea.jpg",
    inStock: true,
  },

  // Посуда
  {
    id: "teaware-1",
    name: "Гайвань керамическая «Белая лоза»",
    nameZh: "盖碗",
    category: "teaware",
    price: 1850,
    weight: "150 мл",
    description:
      "Традиционная гайвань для заваривания чая. Тонкий фарфор с элегантной росписью. Идеальна для улунов и белых чаёв.",
    origin: "Цзиндэчжэнь, Китай",
    image: "/placeholder.svg?height=400&width=400",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "teaware-2",
    name: "Чайник исинская глина «Си Ши»",
    nameZh: "西施壶",
    category: "teaware",
    price: 4500,
    weight: "180 мл",
    description: "Классический чайник формы Си Ши из знаменитой исинской глины. Идеален для пуэров и красных чаёв.",
    origin: "Исин, Китай",
    image: "/placeholder.svg?height=400&width=400",
    inStock: true,
  },
  {
    id: "teaware-3",
    name: "Чахай стекло «Чистота»",
    nameZh: "公道杯",
    category: "teaware",
    price: 850,
    weight: "200 мл",
    description: "Стеклянный чахай (сливник) для равномерного разлива чая. Термостойкое боросиликатное стекло.",
    origin: "Китай",
    image: "/placeholder.svg?height=400&width=400",
    inStock: true,
  },
  {
    id: "teaware-4",
    name: "Чабань бамбук «Путь чая»",
    nameZh: "茶盘",
    category: "teaware",
    price: 3200,
    weight: "45×28 см",
    description:
      "Чайный столик из натурального бамбука с поддоном для слива воды. Компактный размер для домашних чаепитий.",
    origin: "Китай",
    image: "/placeholder.svg?height=400&width=400",
    inStock: true,
  },
  {
    id: "teaware-5",
    name: "Пиалы керамические «Журавль» (6 шт)",
    nameZh: "品茗杯",
    category: "teaware",
    price: 1650,
    weight: "50 мл × 6",
    description: "Набор из 6 пиал для чаепития. Тонкий фарфор с традиционной росписью журавля — символа долголетия.",
    origin: "Цзиндэчжэнь, Китай",
    image: "/placeholder.svg?height=400&width=400",
    inStock: true,
    isNew: true,
  },
  {
    id: "teaware-6",
    name: "Чайные инструменты «Шесть благородных»",
    nameZh: "茶道六君子",
    category: "teaware",
    price: 1200,
    weight: "набор",
    description:
      "Полный набор чайных инструментов: чайная ложка, игла, щипцы, воронка, лопатка, ваза-подставка. Бамбук и нержавеющая сталь.",
    origin: "Китай",
    image: "/placeholder.svg?height=400&width=400",
    inStock: true,
  },
]

// Функции для работы с продуктами из базы данных
export function getProductsByCategory(category: string): Product[] {
  if (typeof window === "undefined") {
    // На сервере возвращаем статические данные
    if (category === "all") return products
    return products.filter((p) => p.category === category)
  }
  // На клиенте данные загружаются через API
  return []
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller)
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew)
}
