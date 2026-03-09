// theme/index.js
export const LIGHT_THEME = {
  link_sky_blue: "#3C9BD9",
  mode: "LIGHT",
  blue_900: "#1500FF",
  card_white: "#ffffff",
  border_100: "#FFFFFF",
  search_input: "#F2F2F2",
  border_new: "#E4E4E7",
  background_new: "#ffffff",
  card_new_text: "#6e6e6e",
  card_border_new: "#e9e9e9",
  card_label_text: "#9B9B9B",
  card_label_text_2: "#515151",
  primary_text: "#262626",
  icon_bg: "#ffeaed",
  icon_color: "#FD7084",
  card_label_text_3: "#515151",
  card_label_text_4: "#515151",
  percentage_bg: "#effbf0",
  percentage_text: "#449648",
  card_label_bg: "#f3f3f3",
  marks_text: "#9b9b9b",
  score_text: "#515151",
  result_btn_bg: "#E6F7F1",
  result_btn_text: "#009B68",
  result_wrong_bg: "#FF3333",
  result_que_text: "#737375",
  result_que_title: "#434343",
  option_border: "#C5C5C5",
  question_item_text: "#262626",
  question_label: "#515151",
  primary: {
    base: "#E53935",
    hover: "#f3f4f6",
  },

  announcement_yellow: "#FFF6EA",

  secondary: {
    base: "",
    hover: "",
  },

  body: {
    light10: "",
    primary: {
      base: "#ffffff",
      hover: "#f3f4f6",
      active: "#dededeff",
    },
    secondary: {
      base: "#f5f5f5",
      hover: "#f3f4f6",
    },
  },
  text: {
    primary: "#262626",
    secondary: "#4f4f4f",
    neutral_gray_600: "#475569",
    neutral_gray_900: "#18181B",
    neutral20: "#343434",
    new_text: "#000000",
  },

  border: {
    primary: "#dcdcdcff",
    secondary: "#d5d5d5ff",
  },

  difficulty: {
    easy: {
      bg: "#E6F7F1",
      text: "#009B68",
    },
    medium: {
      bg: "#FEE4BD",
      text: "#E69925",
    },
    hard: {
      bg: "#FFE6E6",
      text: "#FF3333",
    },
  },

  option: {
    default: {
      // bg: "#f3f3f3",
      border: "#C5C5C5",
    },
    correct: {
      bg: "#E6F7F1",
      border: "#33BB8E",
    },
    wrong: {
      bg: "#FFE6E6",
      border: "#FF5454",
    },
  },

  codingQuestion: {
    failed: {
      border: "#FF3333",
      bg: "#FFE6E6",
      text: "#FF3333",
    },
    success: {
      border: "#00AA72",
      bg: "#E6F7F1",
      text: "#00AA72",
    },
  },

  mockTestResult: {
    pass: "#00AA72",
    fail: "#FF3333",
    total: "#515151",
  },

  submissionStatus: {
    failed: "#FF3333",
    success: "#33BB8E",
  },

  //shadows variations
  shadow: {
    opacity_05: "rgba(0, 0, 0, 0.05)",
    opacity_10: "rgba(0, 0, 0, 0.1)",
    opacity_15: "rgba(0, 0, 0, 0.15)",
    opacity_20: "rgba(0, 0, 0, 0.2)",
    opacity_25: "rgba(0, 0, 0, 0.25)",
    opacity_30: "rgba(0, 0, 0, 0.3)",
    opacity_35: "rgba(0, 0, 0, 0.35)",
    opacity_40: "rgba(0, 0, 0, 0.4)",
    opacity_45: "rgba(0, 0, 0, 0.45)",
    opacity_50: "rgba(0, 0, 0, 0.5)",
  },
};

export const DARK_THEME = {
  link_sky_blue: "#3C9BD9",
  mode: "DARK",
  blue_900: "#FFFFFF",
  card_white: "#343434",
  border_100: "#3B3B3B",
  search_input: "#404040",
  border_new: "#43434300",
  background_new: "#303030",
  card_new_text: "#C5C5C5",
  card_border_new: "#606060",
  card_label_text: "#C5C5C5",
  card_label_text_2: "#ffffff",
  primary_text: "#ffffff",
  icon_bg: "#FC294780",
  icon_color: "#FEBDC6",
  card_label_text_3: "#F4F4F4",
  card_label_text_4: "#F8F8F8",
  percentage_bg: "#44964880",
  percentage_text: "#EFFBF0",
  card_label_bg: "#262626",
  marks_text: "#9B9B9B",
  score_text: "#FFFFFF",
  result_btn_bg: "#004730",
  result_btn_text: "#E6F7F1",
  result_wrong_bg: "#FF5454",
  result_que_text: "#FFFFFF",
  result_que_title: "#F8F8F8",
  option_border: "#656565",
  question_item_text: "#C5C5C5",
  question_label: "#C5C5C5",
  primary: {
    base: "#E53935",
    hover: "#f3f4f6",
  },
  secondary: {
    base: "",
    hover: "",
  },
  announcement_yellow: "#343434",
  body: {
    primary: {
      base: "#262626",
      hover: "#101010",
      active: "#5e5e5eff",
    },
    secondary: {
      base: "#333333ff",
      hover: "#404040ff",
    },
  },
  text: {
    primary: "#ffffff",
    secondary: "#dcdcdc",
    neutral_gray_600: "#FFFFFF",
    neutral_gray_900: "#FFFFFF",
    neutral20: "#dcdcdc",
    new_text: "#000000",
  },

  border: {
    primary: "#777777ff",
    secondary: "#666666ff",
  },

  difficulty: {
    easy: {
      bg: "#004730",
      text: "#E6F7F1",
    },
    medium: {
      bg: "#6A4711",
      text: "#E6F7F1",
    },
    hard: {
      bg: "#6B0000",
      text: "#E6F7F1",
    },
  },
  option: {
    default: {
      // bg: "#262626",
      border: "#656565",
    },
    correct: {
      bg: "#8AD8BE",
      border: "#33BB8E",
    },
    wrong: {
      bg: "#FFB0B0",
      border: "#FF3333",
    },
  },
  codingQuestion: {
    failed: {
      border: "#FF5454",
      bg: "#303030",
      text: "#FF5454",
    },
    success: {
      border: "#33BB8E",
      bg: "#303030",
      text: "#33BB8E",
    },
  },

  mockTestResult: {
    pass: "#00AA72",
    fail: "#FF3333",
    total: "#C5C5C5",
  },

  submissionStatus: {
    failed: "#FF5454",
    success: "#33BB8E",
  },

  //shadows variations
  shadow: {
    opacity_05: "rgba(0, 0, 0, 0.05)",
    opacity_10: "rgba(0, 0, 0, 0.1)",
    opacity_15: "rgba(0, 0, 0, 0.15)",
    opacity_20: "rgba(0, 0, 0, 0.2)",
    opacity_25: "rgba(0, 0, 0, 0.25)",
    opacity_30: "rgba(0, 0, 0, 0.3)",
    opacity_35: "rgba(0, 0, 0, 0.35)",
    opacity_40: "rgba(0, 0, 0, 0.4)",
    opacity_45: "rgba(0, 0, 0, 0.45)",
    opacity_50: "rgba(0, 0, 0, 0.5)",
  },
};

export const reactSelectTheme =
  (isDark = true) =>
  (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      ...(isDark
        ? {
            // Dark Theme
            // Primary colors
            primary: "#777777ff", // Selected option border/accent
            primary25: "rgba(255, 255, 255, 0.1)", // Option hover background
            primary50: "rgba(255, 255, 255, 0.2)", // Option active background
            primary75: "rgba(255, 255, 255, 0.3)", // Option selected background

            // Neutral backgrounds
            neutral0: "#262626", // Main background (control, menu)
            neutral5: "#333333ff", // Hover background
            neutral10: "#404040ff", // Disabled background
            neutral20: "#777777ff", // Border color
            neutral30: "#666666ff", // Border hover
            neutral40: "#666666ff", // No options message color
            neutral50: "#dcdcdc", // Placeholder text
            neutral60: "#dcdcdc", // Arrow and clear indicator
            neutral70: "#ffffff", // Arrow hover
            neutral80: "#ffffff", // Text color
            neutral90: "#ffffff", // Input text
          }
        : {
            // Light Theme
            // Primary colors
            primary: "#4a90e2", // Selected option border/accent
            primary25: "rgba(74, 144, 226, 0.1)", // Option hover background
            primary50: "rgba(74, 144, 226, 0.2)", // Option active background
            primary75: "rgba(74, 144, 226, 0.3)", // Option selected background

            // Neutral backgrounds
            neutral0: "#ffffff", // Main background (control, menu)
            neutral5: "#f8f9fa", // Hover background
            neutral10: "#e9ecef", // Disabled background
            neutral20: "#dee2e6", // Border color
            neutral30: "#ced4da", // Border hover
            neutral40: "#6c757d", // No options message color
            neutral50: "#6c757d", // Placeholder text
            neutral60: "#495057", // Arrow and clear indicator
            neutral70: "#343a40", // Arrow hover
            neutral80: "#212529", // Text color
            neutral90: "#212529", // Input text
          }),
    },
  });
