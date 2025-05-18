import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Picker } from "@react-native-picker/picker";
import styles from "./styles/style";
import DateTimePicker from "@react-native-community/datetimepicker";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Analyze = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const apiUrl =
    "APP SCRIPT API HERE";

  const [compareMode, setCompareMode] = useState("D"); // D, W, M, C
  const [customDates, setCustomDates] = useState({ start: null, end: null }); // สำหรับ C
  const [refreshing, setRefreshing] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      calculateSummary(data);
    }
  }, [compareMode, customDates]);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
      calculateSummary(response.data);
      setLoading(false);
    } catch (err) {
      alert("โหลดข้อมูลผิดพลาด: " + err.message);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const calculateSummary = (data) => {
    let currentStart, currentEnd, prevStart, prevEnd;

    const today = dayjs().startOf("day");

    if (compareMode === "D") {
      currentStart = today;
      currentEnd = today.endOf("day");
      prevStart = today.subtract(1, "day");
      prevEnd = prevStart.endOf("day");
    } else if (compareMode === "W") {
      currentStart = today.startOf("week");
      currentEnd = today.endOf("week");
      prevStart = currentStart.subtract(1, "week");
      prevEnd = prevStart.endOf("week");
    } else if (compareMode === "M") {
      currentStart = today.startOf("month");
      currentEnd = today.endOf("month");
      prevStart = currentStart.subtract(1, "month");
      prevEnd = prevStart.endOf("month");
    } else if (compareMode === "C") {
      if (!customDates.start || !customDates.end) return;
      currentStart = dayjs(customDates.start).startOf("day");
      currentEnd = dayjs(customDates.end).endOf("day");
      // อาจเปรียบเทียบกับช่วงเวลาก่อนหน้านี้ที่มีขนาดเท่ากันก็ได้ หรือปล่อยว่างไว้
      prevStart = null;
      prevEnd = null;
    }

    let currentTotal = 0;
    let prevTotal = 0;
    let currentWant = 0;
    let prevWant = 0;

    const categorySum = {};
    const hourSum = {};
    const channelSum = {};

    data.forEach((item) => {
      const date = dayjs(item.Date);
      const amount = parseFloat(item.Amount || 0);
      const hour = dayjs(item.Time).hour();

      const inCurrent =
        date.isSameOrAfter(currentStart) && date.isSameOrBefore(currentEnd);
      const inPrev =
        prevStart &&
        date.isSameOrAfter(prevStart) &&
        date.isSameOrBefore(prevEnd);

      if (inCurrent) {
        currentTotal += amount;
        if (item.Type === "Want") currentWant += amount;
      }

      if (inPrev) {
        prevTotal += amount;
        if (item.Type === "Want") prevWant += amount;
      }

      if (inCurrent && item.Type === "Want") {
        categorySum[item.Category] = (categorySum[item.Category] || 0) + amount;
        hourSum[hour] = (hourSum[hour] || 0) + amount;
        channelSum[item["Payment Method"]] =
          (channelSum[item["Payment Method"]] || 0) + amount;
      }
    });

    const topCategories = Object.entries(categorySum)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const topHours = Object.entries(hourSum)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const topChannels = Object.entries(channelSum)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([method, amount]) => ({ method, amount }));

    setSummary({
      todayTotal: currentTotal,
      yesterdayTotal: prevTotal,
      todayWant: currentWant,
      yesterdayWant: prevWant,
      totalChange: getPercentChange(currentTotal, prevTotal),
      wantChange: getPercentChange(currentWant, prevWant),
      topCategories: topCategories.map(([cat, amt]) => ({
        name: cat,
        amount: amt,
      })),
      topHours: topHours.map(([h, amt]) => ({ hour: h, amount: amt })),
      topChannels: topChannels,
    });
  };

  const getPercentChange = (today, yesterday) => {
    if (yesterday === 0) return today === 0 ? 0 : 100;
    return (((today - yesterday) / yesterday) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 1, backgroundColor: "#e6f0ff" }}>
      <ScrollView
        style={{ padding: 20, backgroundColor: "#e6f0ff" }}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color: "#003366",
          }}
        >
          📊 Spending Analysis
        </Text>

        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 4 }}>
            ✅ Total expenses
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#006400" }}>
            {summary.todayTotal.toFixed(2)} :{" "}
            {summary.yesterdayTotal.toFixed(2)} B
          </Text>
          <Text style={{ marginTop: 8, color: "#555", marginBottom: 4 }}>
            ↔ compare:{" "}
            <Text style={{ fontWeight: "bold" }}>{summary.totalChange}%</Text>
          </Text>
          
        </View>

        <View
          style={{
            backgroundColor: "#fff5f5",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 4 }}>
            🎈 [Want] expenses
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#b30000" }}>
            {summary.todayWant.toFixed(2)} : {summary.yesterdayWant.toFixed(2)}{" "}
            B
          </Text>
          <Text style={{ marginTop: 8, color: "#555" }}>
            ↔ compare:{" "}
            <Text style={{ fontWeight: "bold" }}>{summary.wantChange}%</Text>
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#ffffff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 8 }}>
            🔥 Categories with Most "Want" Spending
          </Text>
          {summary.topCategories && summary.topCategories.length > 0 ? (
            summary.topCategories.map((item, index) => (
              <Text
                key={index}
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#ff6600",
                  marginLeft: 8,
                }}
              >
                {index + 1}. {item.name} ({item.amount.toFixed(2)} บาท)
              </Text>
            ))
          ) : (
            <Text style={{ fontStyle: "italic", color: "#999" }}>No data</Text>
          )}

          <Text style={{ marginTop: 12, fontSize: 16 }}>
            ⏰ Hours with Highest "Want" Spending
          </Text>
          {summary.topHours && summary.topHours.length > 0 ? (
            summary.topHours.map((item, index) => (
              <Text
                key={index}
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#0077b6",
                  marginLeft: 8,
                }}
              >
                {index + 1}. {item.hour}:00 ({item.amount.toFixed(2)} บาท)
              </Text>
            ))
          ) : (
            <Text style={{ fontStyle: "italic", color: "#999" }}>No data</Text>
          )}
          <Text style={{ marginTop: 12, fontSize: 16 }}>
            💳 Top 3 Payment Methods
          </Text>
          {summary.topChannels && summary.topChannels.length > 0 ? (
            summary.topChannels.map((item, index) => (
              <Text
                key={index}
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#7b2cbf",
                  marginLeft: 8,
                }}
              >
                {index + 1}. {item.method} ({item.amount.toFixed(2)} บาท)
              </Text>
            ))
          ) : (
            <Text style={{ fontStyle: "italic", color: "#999" }}>No data</Text>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          marginBottom: 0,
          backgroundColor: "#aabfff",
          borderRadius: 10,
        }}
      >
        <Text style={{ margin: 5, fontSize: 16 }}>📅 Select time period</Text>

        <View
          style={{
            borderWidth: 0,
            borderColor: "#ddd",
            margin: 5,
            backgroundColor: "#fff",
            borderRadius: 10,
          }}
        >
          <Picker
            selectedValue={compareMode}
            onValueChange={(value) => setCompareMode(value)}
          >
            <Picker.Item label="Today vs yesterday" value="D" />
            <Picker.Item label="This week vs last week" value="W" />
            <Picker.Item label="This month vs last month" value="M" />
            {/* <Picker.Item label="เลือกวันเอง" value="C" /> */}
          </Picker>
        </View>

        {compareMode === "C" && (
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>Start Date:</Text>
            <Text
              onPress={() => setShowStartPicker(true)}
              style={{
                padding: 10,
                backgroundColor: "#fff",
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              {customDates.start
                ? dayjs(customDates.start).format("YYYY-MM-DD")
                : "Select start date"}
            </Text>
            {showStartPicker && (
              <DateTimePicker
                value={
                  customDates.start ? new Date(customDates.start) : new Date()
                }
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
                  if (selectedDate) {
                    setCustomDates((prev) => ({
                      ...prev,
                      start: selectedDate,
                    }));
                  }
                }}
              />
            )}

            <Text style={{ fontSize: 16, marginBottom: 5 }}>End Date:</Text>
            <Text
              onPress={() => setShowEndPicker(true)}
              style={{
                padding: 10,
                backgroundColor: "#fff",
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              {customDates.end
                ? dayjs(customDates.end).format("YYYY-MM-DD")
                : "Select end date"}
            </Text>
            {showEndPicker && (
              <DateTimePicker
                value={customDates.end ? new Date(customDates.end) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndPicker(false);
                  if (selectedDate) {
                    setCustomDates((prev) => ({ ...prev, end: selectedDate }));
                  }
                }}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Analyze;
