// src/data/quizData.ts

export interface QuizItem {
  q: string;
  opts: string[];
  ans: number;
  ex: string;
}

export const TOTAL_QUIZ: QuizItem[] = [
  {
    q: "Thế nào là tăng trưởng kinh tế bền vững?",
    opts: [
      "Là sự tăng trưởng ổn định lâu dài và tốc độ rất cao",
      "Là sự tăng trưởng tương đối cao, ổn định trong thời gian tương đối dài",
      "Sự tăng trưởng gắn liền với bảo vệ môi trường sinh thái và tiến bộ xã hội",
      "Cả b và c",
    ],
    ans: 3,
    ex: "Tăng trưởng kinh tế bền vững yêu cầu sự ổn định trong thời gian dài gắn liền với bảo vệ môi trường sinh thái và tiến bộ xã hội.",
  },
  {
    q: "Trong các nhân tố tăng trưởng kinh tế, Đảng ta xác định nhân tố nào là cơ bản của tăng trưởng nhanh và bền vững?",
    opts: ["Vốn", "Con người", "Khoa học và công nghệ", "Cơ cấu kinh tế, thể chế kinh tế"],
    ans: 1,
    ex: "Đảng ta xác định nhân tố con người là cơ bản, là mục tiêu và động lực của sự phát triển nhanh và bền vững.",
  },
  {
    q: "Tăng trưởng kinh tế có vai trò thế nào?",
    opts: [
      "Là điều kiện để khắc phục tình trạng đói nghèo, lạc hậu",
      "Để tạo thêm việc làm, giảm thất nghiệp",
      "Để củng cố an ninh, quốc phòng",
      "Cả a, b và c",
    ],
    ans: 3,
    ex: "Tăng trưởng kinh tế đóng vai trò cốt lõi trong việc xóa đói giảm nghèo, giải quyết việc làm và củng cố tiềm lực an ninh quốc phòng.",
  },
  {
    q: "Phát triển kinh tế bao gồm những nội dung nào?",
    opts: [
      "Gia tăng GNP hoặc GDP trên đầu người.",
      "Cơ cấu kinh tế thay đổi theo hướng công nghiệp hóa.",
      "Chất lượng cuộc sống tăng lên, môi trường được bảo vệ.",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Phát triển kinh tế là một quá trình toàn diện bao gồm tăng trưởng quy mô kinh tế, dịch chuyển cơ cấu và nâng cao chất lượng cuộc sống.",
  },
  {
    q: "Tiến bộ xã hội được thể hiện ở những mặt nào?",
    opts: [
      "Tiến bộ về kinh tế",
      "Tiến bộ về chính trị, xã hội",
      "Đời sống văn hoá, tinh thần ngày càng được nâng cao",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Tiến bộ xã hội biểu hiện toàn diện trên cả ba mặt: kinh tế, chính trị - xã hội và đời sống văn hóa tinh thần.",
  },
  {
    q: "Sự kiện gì đánh dấu việc V.I.Lênin đã biến chủ nghĩa xã hội từ lý luận thành hiện thực?",
    opts: [
      "Cách mạng tháng Mười Nga 1917",
      "Sự ra đời của Liên Xô",
      "Sự chiến thắng trong nội chiến",
      "Cả a, b, c",
    ],
    ans: 0,
    ex: "Cách mạng tháng Mười Nga năm 1917 thành công đã chính thức đưa CNXH từ lý luận trở thành hiện thực sinh động trên thế giới.",
  },
  {
    q: "Bản chất của khủng hoảng kinh tế TBCN là:",
    opts: [
      "Khủng hoảng sản xuất 'thừa' so với nhu cầu xã hội",
      "Khủng hoảng sản xuất 'thừa' so với sức mua có hạn của quần chúng",
      "Sản xuất 'thiếu hụt' so với sức mua",
      "Nền kinh tế rối loạn",
    ],
    ans: 1,
    ex: "Khủng hoảng kinh tế TBCN mang bản chất là khủng hoảng sản xuất thừa, nhưng là 'thừa' so với sức mua có hạn của người lao động chứ không phải so với nhu cầu thực tế.",
  },
  {
    q: "Chu kỳ khủng hoảng kinh tế có mấy giai đoạn?",
    opts: ["2", "3", "4", "5"],
    ans: 2,
    ex: "Một chu kỳ khủng hoảng kinh tế của CNTB thường trải qua 4 giai đoạn: Khủng hoảng, Tiêu điều, Phục hồi và Hưng thịnh.",
  },
  {
    q: "Cuộc đại khủng hoảng kinh tế của CNTB nổ ra vào thời kỳ nào?",
    opts: ["1929 - 1933", "1954 - 1958", "1960 - 1963", "1973 - 1975"],
    ans: 0,
    ex: "Cuộc đại khủng hoảng kinh tế thế giới (hay còn gọi là thời kỳ Đại suy thoái) nổ ra khốc liệt nhất vào giai đoạn 1929 - 1933.",
  },
  {
    q: "Ai là người đầu tiên chia tư bản thành bất biến (c) và khả biến (v)?",
    opts: ["A.Smith", "D.Ricardo", "C.Mác", "F.Quesnay"],
    ans: 2,
    ex: "Các nhà kinh tế học trước đó chỉ chia thành tư bản cố định và lưu động. C.Mác là người đầu tiên chia thành tư bản bất biến (c) và khả biến (v) để làm rõ nguồn gốc bóc lột.",
  },
  {
    q: "Tư bản bất biến (c) là bộ phận tư bản:",
    opts: [
      "Giá trị chuyển dần vào sản phẩm",
      "Không thay đổi về lượng, chuyển nguyên vẹn sang sản phẩm",
      "Tăng lên trong quá trình sản xuất",
      "Chuyển ngay sau một chu kỳ",
    ],
    ans: 1,
    ex: "Tư bản bất biến (c) tồn tại dưới hình thức tư liệu sản xuất, giá trị của nó được bảo tồn và chuyển nguyên vẹn vào sản phẩm, không thay đổi về lượng giá trị.",
  },
  {
    q: "Tư bản khả biến (v) là bộ phận tư bản:",
    opts: [
      "Luôn biến đổi về lượng",
      "Sức lao động của công nhân làm thuê",
      "Nguồn gốc của giá trị thặng dư",
      "Cả b và c",
    ],
    ans: 3,
    ex: "Tư bản khả biến (v) dùng để mua sức lao động. Trong quá trình sản xuất, nó không những tái sản xuất ra giá trị của bản thân nó mà còn tạo ra giá trị thặng dư (m).",
  },
  {
    q: "Tư bản cố định là gì?",
    opts: [
      "TLSX như nhà xưởng, máy móc",
      "Tư bản bất biến",
      "Giá trị chuyển dần sang sản phẩm",
      "Cả a và c",
    ],
    ans: 3,
    ex: "Tư bản cố định bao gồm các tư liệu sản xuất như nhà xưởng, thiết bị, máy móc có đặc điểm là tham gia toàn bộ vào sản xuất nhưng giá trị chuyển dần từng phần vào sản phẩm.",
  },
  {
    q: "Tư bản lưu động bao gồm:",
    opts: [
      "Sức lao động, nguyên vật liệu, nhiên liệu",
      "Tham gia từng phần vào sản xuất",
      "Giá trị chuyển hết sang sản phẩm sau một chu kỳ",
      "Cả a và c",
    ],
    ans: 3,
    ex: "Tư bản lưu động gồm sức lao động (v) và một phần tư bản bất biến như nguyên nhiên vật liệu. Giá trị của nó chuyển hết toàn bộ vào sản phẩm sau một chu kỳ sản xuất.",
  },
  {
    q: "Hao mòn hữu hình của máy móc là do:",
    opts: [
      "Do sử dụng và tác động tự nhiên",
      "Do tiến bộ khoa học kỹ thuật",
      "Do máy móc cũ",
      "Khấu hao nhanh",
    ],
    ans: 0,
    ex: "Hao mòn hữu hình là sự mất mát về giá trị sử dụng và giá trị do quá trình làm việc (ma sát, hao tổn) hoặc do tác động của tự nhiên khi không sử dụng.",
  },
  {
    q: "Hao mòn vô hình là do:",
    opts: [
      "Sử dụng",
      "Tiến bộ kỹ thuật tạo ra máy mới rẻ hơn/năng suất hơn",
      "Tự nhiên",
      "Cả a và b",
    ],
    ans: 1,
    ex: "Hao mòn vô hình xảy ra thuần túy do sự phát triển của lực lượng sản xuất và tiến bộ kỹ thuật, làm xuất hiện các máy móc mới có hiệu suất cao hơn hoặc giá thành rẻ hơn.",
  },
  {
    q: "Tích lũy tư bản là:",
    opts: [
      "Biến một phần giá trị thặng dư thành tư bản",
      "Tích lũy có trước CNTB",
      "Tích lũy do bạo lực",
      "Tiết kiệm tư bản",
    ],
    ans: 0,
    ex: "Tích lũy tư bản là việc nhà tư bản sử dụng một phần giá trị thặng dư (m) để gộp vào tư bản ban đầu, tiếp tục mở rộng quy mô sản xuất.",
  },
  {
    q: "Nguồn gốc của tích lũy tư bản là:",
    opts: ["Tài sản kế thừa", "Lợi nhuận", "Giá trị thặng dư", "Của cái tiết kiệm"],
    ans: 2,
    ex: "Nguồn gốc duy nhất cấu thành nên tích lũy tư bản chính là giá trị thặng dư (m) do công nhân làm thuê tạo ra bị nhà tư bản chiếm đoạt.",
  },
  {
    q: "Tích tụ tư bản là:",
    opts: [
      "Tăng quy mô tư bản cá biệt bằng tư bản hóa giá trị thặng dư",
      "Kết quả của tích lũy",
      "Làm tăng tư bản xã hội",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Tích tụ tư bản là quá trình tăng quy mô tư bản cá biệt bằng cách trích từ giá trị thặng dư thu được. Nó là kết quả trực tiếp của tích lũy và làm tăng tổng tư bản xã hội.",
  },
  {
    q: "Tập trung tư bản là:",
    opts: [
      "Hợp nhất các tư bản cá biệt nhỏ thành lớn",
      "Làm tăng tư bản xã hội",
      "Phản ánh quan hệ trực tiếp các nhà tư bản",
      "Cả a, c",
    ],
    ans: 3,
    ex: "Tập trung tư bản là sự liên kết, tổ hợp các tư bản cá biệt sẵn có trong xã hội thành một tư bản lớn hơn. Nó không làm tăng tổng tư bản xã hội mà chỉ sắp xếp lại cơ cấu sở hữu.",
  },
  {
    q: "Sự giống nhau giữa tích tụ và tập trung tư bản là:",
    opts: ["Nguồn gốc", "Vai trò", "Tăng quy mô tư bản cá biệt", "Tăng quy mô tư bản xã hội"],
    ans: 2,
    ex: "Dù có nguồn gốc và tác động đến tư bản xã hội khác nhau, nhưng cả tích tụ và tập trung tư bản đều dẫn đến kết quả chung là làm tăng quy mô của một tư bản cá biệt.",
  },
  {
    q: "Cấu tạo hữu cơ của tư bản là:",
    opts: [
      "Quan hệ TLSX và sức lao động",
      "Quan hệ giữa tư bản bất biến (c) và tư bản khả biến (v)",
      "Phản ánh mặt hiện vật và giá trị",
      "Cả a, b, c",
    ],
    ans: 3,
    ex: "Cấu tạo hữu cơ là cấu tạo giá trị của tư bản (c/v), do cấu tạo kỹ thuật (TLSX/Sức lao động) quyết định và phản ánh sự biến động của cấu tạo kỹ thuật đó.",
  },
  {
    q: "Thời gian chu chuyển của tư bản gồm:",
    opts: [
      "Thời gian sản xuất và thời gian lưu thông",
      "Thời gian lao động và thời gian dự trữ",
      "Thời gian sản xuất và thời gian tiêu thụ",
      "Thời gian lưu thông và thời gian gián đoạn",
    ],
    ans: 0,
    ex: "Thời gian chu chuyển của tư bản được tính bằng tổng thời gian tư bản nằm trong vòng quay sản xuất kết hợp với thời gian thực hiện lưu thông trên thị trường.",
  },
  {
    q: "Nhân tố nào ảnh hưởng đến thời gian sản xuất?",
    opts: ["Dự trữ sản xuất", "Tính chất ngành sản xuất", "Năng suất lao động", "Cả a, b, c"],
    ans: 3,
    ex: "Thời gian sản xuất chịu tác động lớn bởi các yếu tố đặc thù của ngành, trình độ công nghệ tăng năng suất và thời gian vật tư nằm ở dạng dự trữ chuẩn bị.",
  },
  {
    q: "Cách rút ngắn thời gian sản xuất?",
    opts: ["Cải tiến kỹ thuật", "Tăng năng suất lao động", "Cải tiến tổ chức sản xuất", "Cả a, b, c"],
    ans: 3,
    ex: "Để tối ưu và giảm thời gian sản xuất, doanh nghiệp phải ứng dụng công nghệ hiện đại, thúc đẩy năng suất và tổ chức dây chuyền khoa học.",
  },
  {
    q: "Cách rút ngắn thời gian lưu thông?",
    opts: ["Giảm giá", "Nâng cao chất lượng", "Quảng cáo, cải tiến phương thức bán", "Cả a, b, c"],
    ans: 3,
    ex: "Thời gian lưu thông được rút ngắn thông qua các chiến lược thị trường như điều chỉnh giá cả phù hợp, nâng chất lượng sản phẩm và tối ưu kênh phân phối, tiếp thị.",
  },
  {
    q: "Thu nhập quốc dân về mặt giá trị bao gồm:",
    opts: ["c + v + m", "Toàn bộ giá trị mới (v+m) tạo ra", "Chỉ có c+v", "v+m"],
    ans: 1,
    ex: "Thu nhập quốc dân là phần giá trị mới hoàn toàn do lao động sống tạo ra trong năm, được ký hiệu về mặt lượng giá trị là (v + m).",
  },
  {
    q: "Ai phát hiện phạm trù cấu tạo hữu cơ của tư bản?",
    opts: ["A.Smith", "D.Ricardo", "C.Mác", "Ph.Ăngghen"],
    ans: 2,
    ex: "C.Mác là nhà kinh tế chính trị đầu tiên phát hiện ra cấu tạo hữu cơ (c/v), vạch rõ mối quan hệ khăng khít giữa kỹ thuật và giá trị tư bản.",
  },
  {
    q: "Tỷ suất lợi nhuận (p') phản ánh:",
    opts: ["Trình độ bóc lột", "Nghệ thuật quản lý", "Hiệu quả đầu tư", "Cả a, b, c"],
    ans: 2,
    ex: "Trình độ bóc lột do tỷ suất giá trị thặng dư (m') phản ánh. Còn tỷ suất lợi nhuận (p') chỉ phản ánh mức độ sinh lời và hiệu quả đầu tư của toàn bộ vốn.",
  },
  {
    q: "Nguyên nhân hình thành lợi nhuận bình quân:",
    opts: ["Cạnh tranh trong ngành", "Cạnh tranh giữa các ngành", "Chạy theo giá trị thặng dư", "Cạnh tranh nội bộ ngành"],
    ans: 1,
    ex: "Cạnh tranh giữa các ngành khác nhau dẫn đến dòng vốn tự do di chuyển từ ngành có tỷ suất lợi nhuận thấp sang ngành cao, hình thành nên tỷ suất lợi nhuận bình quân.",
  },
  // ─── 20 CÂU BỔ SUNG MỚI ĐÃ ĐƯỢC CHUẨN HÓA ───────────────────────────────
  {
    q: "Nguyên nhân hình thành lợi nhuận độc quyền:",
    opts: ["Cạnh tranh nội bộ ngành", "Sự thèm khát giá trị thặng dư", "Địa vị độc quyền", "Cả a, b, c"],
    ans: 2,
    ex: "Lợi nhuận độc quyền thu được là do các tổ chức độc quyền áp đặt mức giá độc quyền cao khi bán và giá độc quyền thấp khi mua dựa trên địa vị độc quyền của mình.",
  },
  {
    q: "Giá trị thặng dư tương đối và siêu ngạch giống nhau ở:",
    opts: ["Tiền đề tăng năng suất lao động", "Rút ngắn thời gian lao động cần thiết", "Kéo dài lao động thặng dư", "Cả a, b, c"],
    ans: 3,
    ex: "Cả hai phương pháp đều dựa trên cơ sở tăng năng suất lao động để rút ngắn thời gian lao động cần thiết, từ đó kéo dài thời gian lao động thặng dư một cách tương ứng.",
  },
  {
    q: "Đặc điểm của tư bản giả là:",
    opts: ["Có thể mua bán", "Mang lại thu nhập", "Giá cả không do giá trị quyết định", "Cả a, b, c"],
    ans: 3,
    ex: "Tư bản giả (như cổ phiếu, trái phiếu) tồn tại dưới dạng chứng khoán mang lại thu nhập, có thể mua bán trên thị trường nhưng giá trị của chúng không do hao phí lao động quyết định mà dựa trên thu nhập kỳ vọng.",
  },
  {
    q: "Vai trò của máy móc trong tạo ra giá trị thặng dư:",
    opts: ["Nguồn gốc", "Tiền đề vật chất", "Yếu tố quyết định", "Không đóng góp gì"],
    ans: 1,
    ex: "Máy móc chỉ đóng vai trò là tiền đề vật chất, giúp tăng năng suất lao động chứ bản thân nó không tự sinh ra giá trị mới. Nguồn gốc duy nhất của giá trị thặng dư vẫn là sức lao động sống.",
  },
  {
    q: "Giá cả sản xuất bằng:",
    opts: ["c + v + m", "c + v", "k + p (chi phí sản xuất + lợi nhuận bình quân)", "c + m"],
    ans: 2,
    ex: "Khi lợi nhuận chuyển hóa thành lợi nhuận bình quân (p), giá trị hàng hóa sẽ chuyển hóa tương ứng thành giá cả sản xuất, được tính bằng chi phí sản xuất (k) cộng lợi nhuận bình quân (p).",
  },
  {
    q: "Tín dụng thương mại sử dụng phương tiện gì?",
    opts: ["Cổ phiếu", "Trái phiếu", "Kỳ phiếu", "Công thái"],
    ans: 2,
    ex: "Tín dụng thương mại là quan hệ mua bán chịu hàng hóa giữa các nhà tư bản trực tiếp sản xuất, công cụ giao dịch cốt lõi của nó là kỳ phiếu thương mại.",
  },
  {
    q: "Nguồn vốn ngân hàng huy động từ đâu?",
    opts: ["Tiền tự có", "Tiền nhàn rỗi của tư bản sản xuất", "Tiền của các nhà tư bản thực lợi", "Cả a, b, c"],
    ans: 3,
    ex: "Ngân hàng huy động tổng hợp từ nguồn vốn tự có ban đầu, tiền nhàn rỗi gửi vào của các doanh nghiệp lẫn các dòng tiền tiết kiệm, nhàn rỗi trong dân cư.",
  },
  {
    q: "Đặc điểm tín dụng nhà nước:",
    opts: ["Lãi suất cao", "Thời hạn dài, lãi suất thấp", "Thời hạn ngắn", "Cạnh tranh"],
    ans: 1,
    ex: "Tín dụng nhà nước phục vụ mục đích công và phát triển vĩ mô quốc gia, thường có tính chất chu kỳ dài hạn và áp dụng mức lãi suất ưu đãi, thấp hơn thương mại.",
  },
  {
    q: "Lợi nhuận ngân hàng xác định theo:",
    opts: ["Tỷ suất lợi nhuận bình quân", "Tỷ suất lợi nhuận", "Tỷ suất giá trị thặng dư", "Tỷ suất lợi tức"],
    ans: 0,
    ex: "Kinh doanh ngân hàng là một ngành kinh tế độc lập, do đó lợi nhuận ngân hàng thu được cũng phải tương đương với tỷ suất lợi nhuận bình quân của các ngành đầu tư khác.",
  },
  {
    q: "Địa tô TBCN là:",
    opts: ["Tiền thuê đất", "Độ màu mỡ đất", "Một phần lợi nhuận bình quân", "Phần giá trị thặng dư do công nhân tạo ra"],
    ans: 3,
    ex: "Bản chất địa tô TBCN là phần giá trị thặng dư dôi ra ngoài lợi nhuận bình quân, do công nhân nông nghiệp làm thuê tạo ra và bị nhà tư bản nộp lại cho địa chủ.",
  },
  {
    q: "Địa tô chênh lệch I do:",
    opts: ["Độ màu mỡ tự nhiên", "Vị trí thuận lợi", "Đầu tư thâm canh", "Cả a và b"],
    ans: 3,
    ex: "Địa tô chênh lệch I thu được trên những thửa ruộng có điều kiện tự nhiên thuận lợi sẵn có, cụ thể bao gồm độ màu mỡ tự nhiên cao hoặc vị trí địa lý gần nơi tiêu thụ.",
  },
  {
    q: "Địa tô chênh lệch II do:",
    opts: ["Độ màu mỡ tự nhiên", "Đầu tư thêm mà có", "Vị trí thuận lợi", "Độc quyền tư hữu"],
    ans: 1,
    ex: "Địa tô chênh lệch II gắn liền với việc đầu tư thâm canh, cải tiến kỹ thuật, bón thêm phân bón làm tăng nhân tạo độ màu mỡ của đất trên cùng một diện tích ruộng.",
  },
  {
    q: "Loại ruộng đất nào chỉ có địa tô tuyệt đối?",
    opts: ["Ruộng tốt", "Ruộng trung bình", "Ruộng xấu", "Tất cả"],
    ans: 2,
    ex: "Ruộng xấu hoàn toàn không sinh ra địa tô chênh lệch. Tuy nhiên, do quyền độc quyền tư hữu ruộng đất, người thuê vẫn bắt buộc phải nộp một khoản phí tối thiểu, đó chính là địa tô tuyệt đối.",
  },
  {
    q: "Giá cả ruộng đất phụ thuộc vào:",
    opts: ["Độ màu mỡ", "Vị trí", "Mức địa tô", "Cả a, b, c"],
    ans: 3,
    ex: "Giá cả ruộng đất được coi là địa tô bản vị hóa. Nó chịu sự tác động đồng thời của các yếu tố cấu thành nên năng suất của đất (độ màu mỡ, vị trí) và tỷ lệ thuận trực tiếp với mức địa tô thu được.",
  },
  {
    q: "Trong CNTB, giá cả nông phẩm được xác định theo giá cả ở loại đất nào?",
    opts: ["Đất tốt", "Đất trung bình", "Đất xấu", "Mức trung bình các loại"],
    ans: 2,
    ex: "Do diện tích đất tốt và trung bình có hạn không đủ đáp ứng nhu cầu xã hội, bắt buộc phải canh tác trên đất xấu. Vì vậy giá cả nông phẩm TBCN phải được thiết lập theo điều kiện sản xuất trên đất xấu nhất để người canh tác ở đó có thể thu hồi vốn.",
  },
  {
    q: "Tư bản cho vay là tư bản:",
    opts: ["Tiềm thế", "Hoạt động", "Thương nghiệp", "Công nghiệp"],
    ans: 0,
    ex: "Tư bản cho vay là tư bản tiềm thế (tư bản đặc biệt) tách biệt khỏi sản xuất trực tiếp, nó nhường quyền sử dụng vốn cho nhà tư bản hoạt động để thu về lợi tức.",
  },
  {
    q: "Lợi tức là:",
    opts: ["Một phần lợi nhuận", "Lợi nhuận siêu ngạch", "Lợi nhuận bình quân", "Lợi nhuận ngân hàng"],
    ans: 0,
    ex: "Lợi tức (z) là một phần của lợi nhuận bình quân mà nhà tư bản hoạt động thu được từ sản xuất, trích ra để trả cho nhà tư bản cho vay sở hữu nguồn tiền.",
  },
  {
    q: "Cấu tạo hữu cơ của tư bản tăng lên:",
    opts: ["Phản ánh sự phát triển lực lượng sản xuất", "C tăng tương đối", "V giảm tương đối", "Cả a, b, c"],
    ans: 3,
    ex: "Khi lực lượng sản xuất phát triển, máy móc công nghệ (c) được trang bị nhiều hơn, dẫn đến lượng tư bản bất biến tăng lên tương đối so với lượng tư bản khả biến (v) mua sức lao động.",
  },
  {
    q: "Giá cả sản xuất là biểu hiện của quy luật:",
    opts: ["Giá trị", "Giá trị thặng dư", "Cạnh tranh", "Cung cầu"],
    ans: 0,
    ex: "Giá cả sản xuất không phủ nhận quy luật giá trị. Nó là hình thức biểu hiện cụ thể, chuyển hóa phức tạp của quy luật giá trị trong giai đoạn chủ nghĩa tư bản tự do cạnh tranh.",
  },
  {
    q: "Mục đích trực tiếp của nền sản xuất TBCN là:",
    opts: ["Tạo của cải", "Mở rộng thống trị", "Tạo giá trị thặng dư", "Làm lệ thuộc lao động"],
    ans: 2,
    ex: "Mục đích tối thượng và trực tiếp thúc đẩy hành vi của mọi nhà tư bản trong quá trình vận hành sản xuất kinh doanh là chiếm đoạt tối đa giá trị thặng dư (m).",
  },
];