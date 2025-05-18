import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  Button,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BarChart, PieChart, LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import styles from "./styles/style";
import { useFocusEffect } from "@react-navigation/native";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const screenWidth = Dimensions.get("window").width;

const App = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("today");
  const [customDate, setCustomDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const apiUrl =
    "APP SCRIPT API HERE";

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    filterData();
  }, [data, period, customDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("โหลดข้อมูลผิดพลาด: " + err.message);
    }
  };

  const filterData = () => {
    const today = dayjs();
    let start, end;

    if (period === "today") {
      start = today.startOf("day");
      end = today.endOf("day");
    } else if (period === "week") {
      start = today.startOf("week");
      end = today.endOf("week");
    } else if (period === "month") {
      start = today.startOf("month");
      end = today.endOf("month");
    } else if (period === "custom") {
      const selected = dayjs(customDate);
      start = selected.startOf("day");
      end = selected.endOf("day");
    }

    const filteredData = data.filter((item) => {
      const itemDate = dayjs(item.Date, "YYYY-MM-DD");
      return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end);
    });

    setFiltered(filteredData);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setCustomDate(selectedDate);
    }
    setShowPicker(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getCategoryData = () => {
    const categories = ["Food", "Supplies", "Services", "Others"];
    const categoryData = {
      Food: 0,
      Supplies: 0,
      Services: 0,
      Others: 0,
    };

    filtered.forEach((item) => {
      if (categories.includes(item.Category)) {
        categoryData[item.Category] += parseFloat(item.Amount);
      }
    });

    return categories.map((category) => categoryData[category]);
  };

  const getExpenseTypeData = () => {
    const expenseTypes = ["Need", "Want", "Invest"];
    const expenseData = {
      Need: 0,
      Want: 0,
      Invest: 0,
    };

    filtered.forEach((item) => {
      if (expenseTypes.includes(item.Type)) {
        expenseData[item.Type] += parseFloat(item.Amount);
      }
    });

    return expenseTypes.map((type) => expenseData[type]);
  };

  const barChartData = {
    labels: ["Food", "Supplies", "Services", "Others"],
    datasets: [
      {
        data: getCategoryData(),
      },
    ],
  };
  const barChartConfig = {
    backgroundColor: "#e6ecff",
    backgroundGradientFrom: "#e6ecff",
    backgroundGradientTo: "#e6ecff",
    decimalPlaces: 2,
    // color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`, // สีม่วงอ่อน
    // labelColor: (opacity = 1) => `rgba(88, 0, 117, ${opacity})`,
    color: (opacity = 1) => `rgba(0, 200, 100, ${opacity})`, // น้ำเงินสด
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // น้ำเงินเข้ม
    style: { borderRadius: 16 },
    propsForBackgroundLines: {
      stroke: "#d9c6f5",
    },
    // fillShadowGradient: "#9966ff",
    fillShadowGradient: "#43e882", // เงาแท่งกราฟ — น้ำเงินฟ้า
    fillShadowGradientOpacity: 1,
  };

  const getTop3SpendingCategories = () => {
    const categories = ["Food", "Supplies", "Services", "Others"];
    const categoryData = {
      Food: 0,
      Supplies: 0,
      Services: 0,
      Others: 0,
    };

    // ใช้ข้อมูลทั้งหมด ไม่กรอง Type
    filtered.forEach((item) => {
      if (categories.includes(item.Category)) {
        categoryData[item.Category] += parseFloat(item.Amount);
      }
    });

    // แปลงเป็น array แล้วเรียงลำดับตามจำนวนเงินที่ใช้จ่าย
    const sortedCategories = Object.entries(categoryData)
      .sort((a, b) => b[1] - a[1]) // มากไปน้อย
      .slice(0, 3); // เอาแค่ 3 อันดับแรก

    return sortedCategories;
  };

  // PIE CHART

  const pieChartData = [
    {
      name: "Need",
      population: getExpenseTypeData()[0],
      color: "#30a2ff",
      legendFontColor: "#4A4A4A",
      legendFontSize: 15,
    },
    {
      name: "Want",
      population: getExpenseTypeData()[1],
      color: "#ff9bb4",
      legendFontColor: "#4A4A4A",
      legendFontSize: 15,
    },
    {
      name: "Invest",
      population: getExpenseTypeData()[2],
      color: "#52f9ee",
      legendFontColor: "#4A4A4A",
      legendFontSize: 15,
    },
  ];

  // LINE CHART

  const getHourlySpending = () => {
    const hourlySpending = Array(24).fill(0); // Array to store total spending per hour

    filtered.forEach((item) => {
      const hour = dayjs(item.Time).hour();
      hourlySpending[hour] += parseFloat(item.Amount);
    });

    return hourlySpending;
  };

  const lineChartData = {
    labels: Array.from({ length: 24 }, (_, i) =>
      i % 3 === 0 ? `${i}:00` : ""
    ),
    datasets: [
      {
        data: getHourlySpending(),
        // color: (opacity = 1) => `rgba(246, 108, 123, ${opacity})`, // แดงพาสเทล
        color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`, // ม่วงเข้ม

        strokeWidth: 2,
      },
    ],
  };

  // ฟังก์ชันนี้คืนค่า 3 ชั่วโมงที่มีการใช้จ่ายมากที่สุด ไม่จำกัดประเภท
  const getTop3SpendingHours = () => {
    const hourlySpending = Array(24).fill(0);

    // ใช้ข้อมูลทั้งหมด ไม่กรองประเภท
    filtered.forEach((item) => {
      const hour = dayjs(item.Time).hour(); // ดึงชั่วโมงจาก Time
      hourlySpending[hour] += parseFloat(item.Amount);
    });

    // จัดอันดับและเลือก Top 3 ชั่วโมงที่ใช้จ่ายมากที่สุด
    const top3 = hourlySpending
      .map((amount, hour) => ({ hour, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return top3;
  };

  // CHART CONFIG
  const chartConfig = {
    backgroundColor: "#e6ecff",
    backgroundGradientFrom: "#e6ecff",
    backgroundGradientTo: "#e6ecff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(74, 74, 74, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForBackgroundLines: {
      stroke: "#d9c6f5",
    },

    // เพิ่มตรงนี้
    fillShadowGradient: "#9966ff", // สีพื้นที่ใต้กราฟ — ม่วง
    fillShadowGradientOpacity: 1, // ความโปร่งแสง
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const getTotalAmount = () => {
    return filtered
      .reduce((sum, item) => sum + parseFloat(item.Amount || 0), 0)
      .toFixed(2);
  };

  const getTop5Descriptions = () => {
    const descriptionMap = {};

    filtered.forEach((item) => {
      const desc = item.Description || "No Description";
      const amount = parseFloat(item.Amount) || 0;

      if (descriptionMap[desc]) {
        descriptionMap[desc] += amount;
      } else {
        descriptionMap[desc] = amount;
      }
    });

    return Object.entries(descriptionMap)
      .sort((a, b) => b[1] - a[1]) // เรียงจากมากไปน้อย
      .slice(0, 5); // เอาแค่ 5 รายการ
  };

  return (
    // BACKGROUND COLOR
    <View style={{ flex: 1, backgroundColor: "#e6ecff" }}>
      <View style={styles.totalSummaryContainer}>
        <Text style={styles.totalTexthead}>Total</Text>
        <Text style={styles.totalTexthead}>{getTotalAmount() + " B"}</Text>
      </View>
      <View style={styles.dataTableContainer}>
        <View style={styles.dataTableHeader}>
          <Text style={styles.totalText}>Des.</Text>
          <Text style={styles.totalText}>Day</Text>
          <Text style={styles.totalText}>Time</Text>
          <Text style={styles.totalText}>Amount</Text>
          <Text style={styles.totalText}>Category</Text>
        </View>

        <ScrollView
          style={{ height: 150 }}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {filtered.map((item, index) => (
            <View key={index} style={styles.TableContainer}>
              <Text style={{ flex: 1 }}>{item.Description}</Text>
              <Text style={{ flex: 1 }}>
                {dayjs(item.Date).format("D ") + dayjs(item.Date).format("dd")}
              </Text>
              <Text style={{ flex: 1 }}>
                {dayjs(item.Time).format("HH:mm")}
              </Text>
              <Text style={{ flex: 1 }}>{item.Amount}</Text>
              <Text style={{ flex: 1 }}>{item.Category}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.SelectRange}>
        {[
          { label: "1D", value: "today" },
          { label: "1W", value: "week" },
          { label: "1M", value: "month" },
          { label: "C", value: "custom" },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setPeriod(item.value)}
            style={{
              backgroundColor: period === item.value ? "#3e4f70" : "#e6ecff",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: period === item.value ? "#fff" : "#000",
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {period === "custom" && (
        <View style={{ marginVertical: 0 }}>
          <Button
            title={`${dayjs(customDate).format("YYYY-MM-DD")}`}
            onPress={() => setShowPicker(true)}
          />
          {showPicker && (
            <DateTimePicker
              value={customDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* <Text style={{ fontSize: 18, marginBottom: 0 }}>Select the time:</Text> */}

        {filtered.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.getstart}>Let's get start adding expenses</Text>
          </View>
        ) : (
          <View style={{ marginTop: 0 }}>
            {/* ตารางข้อมูล */}

            {/* กราฟวงกลม */}
            <View style={styles.BoxContainer}>
              <Text style={styles.HeaderText}>Spending by Type</Text>
              <PieChart
                data={pieChartData}
                width={screenWidth - 20}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                // absolute
              />
              <View style={styles.Top3Adjust}>
                <Text style={styles.Top3Text}>Expense Breakdown by Type</Text>
                {["Need", "Want", "Invest"].map((type, index) => (
                  <View
                    key={type}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Text>{type} → </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {getExpenseTypeData()[index].toFixed(2)}{" "}
                      </Text>
                      B{" "}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* กราฟแท่ง */}
            <View style={styles.BoxContainer}>
              <Text style={styles.HeaderText}>Total Spending by Category</Text>
              <BarChart
                data={barChartData}
                width={screenWidth - 40}
                height={220}
                yAxisLabel="฿"
                chartConfig={barChartConfig}
                fromZero={true}
                showBarTops={true}
                style={{
                  marginVertical: 8,
                  borderRadius: 5,
                  alignSelf: "center",
                }}
              />

              <View style={styles.emptyText}>
                <Text style={styles.Top3Text}>Top 3 Spending Categories</Text>
                <View style={styles.Top3Adjust}>
                  {getTop3SpendingCategories().map(
                    ([category, amount], index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 14, textAlign: "center" }}
                      >
                        No. {index + 1}: {category} →{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {amount.toFixed(2)}
                        </Text>{" "}
                        B
                      </Text>
                    )
                  )}
                </View>
              </View>
            </View>

            {/* กราฟเส้น (รายชั่วโมง) */}
            <View style={styles.BoxContainer}>
              <Text style={styles.HeaderText}>Total Hourly Spending</Text>
              <LineChart
                data={lineChartData}
                width={screenWidth - 40}
                height={250}
                chartConfig={chartConfig}
                bezier
                fromZero={true}
                withDots={false}
                showBarTops={true}
                style={{
                  marginVertical: 8,
                  borderRadius: 5,
                  alignSelf: "center",
                }}
              />

              <Text style={styles.Top3Text2}>
                Top 3 Hours with Highest [Want] Spending
              </Text>
              <View style={styles.Top3Adjust}>
                {getTop3SpendingHours().map((item, index) => (
                  <Text
                    key={index}
                    style={{ fontSize: 14, textAlign: "center" }}
                  >
                    No. {index + 1}: {item.hour}:00 - {item.hour + 1}:00 →{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {item.amount.toFixed(2)}
                    </Text>{" "}
                    B
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.BoxContainer}>
              <Text style={styles.Top3Text2}>🔝 Top 5 Descriptions</Text>
              <View style={styles.Top3Adjust}>
              {getTop5Descriptions().map(([desc, total], index) => (
                <Text
                  key={index}
                  style={{ fontSize: 14, textAlign: "center" }}
                  >
                  <Text style={{ flex: 2 }}>{desc} → </Text>
                  <Text style={{ flex: 1, fontWeight: "bold"  }}>
                    {total.toFixed(2)}
                  </Text> B
                </Text>
              ))}</View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default App;
