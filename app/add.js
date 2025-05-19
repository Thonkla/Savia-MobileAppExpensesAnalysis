import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import styles from "./styles/style";

export default function AddExpense() {
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(":").slice(0, 2).join(":");
  };

  const [form, setForm] = useState({
    Amount: "",
    Category: "Food", // Set default value
    Type: "Need", // Set default value
    Description: "",
    "Payment Method": "NEXT", // Set default value
    Note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // State for tracking submission
  const [submitStatus, setSubmitStatus] = useState(""); // State for submit status message

  useEffect(() => {
    // Do not set Date and Time here as we will add them during the submission
  }, []);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Set submitting state to true
    setSubmitStatus("กำลังบันทึก..."); // Show 'Saving...' message

    // Add Date and Time to the form data before sending it
    const updatedForm = {
      ...form,
      Date: getCurrentDate(),
      Time: getCurrentTime(),
    };

    try {
      const response = await fetch(
        "APP SCRIPT API HERE",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedForm),
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} | Message: ${result}`
        );
      }

      setSubmitStatus("Success"); // Show 'Saved successfully' message
      Alert.alert("Success", "Save successfully");
      setForm({
        Amount: "",
        Category: "Food", // Reset to default value
        Type: "Need", // Reset to default value
        Description: "",
        "Payment Method": "NEXT", // Reset to default value
        Note: "",
      });
    } catch (error) {
      setSubmitStatus("fail"); // Show error message
      Alert.alert("fail", error.message);
    } finally {
      setIsSubmitting(false); // Set submitting state to false
    }
  };

  const renderField = (label, component) => (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
    >
      <Text style={{ width: 110 }}>{label}</Text>
      <View style={{ flex: 1 }}>{component}</View>
    </View>
  );

  return (
    // d6e0ff
    <ScrollView style={{ padding: 20, backgroundColor: "#e6ecff" }}>
      <View style={styles.BoxContainer2}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Add expense
        </Text>

        {renderField(
          "    Name",
          <TextInput
            placeholder="name.."
            value={form.Description}
            onChangeText={(text) => handleChange("Description", text)}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginRight: 20,
              backgroundColor: "#e6ecff",
              borderRadius: 5,
            }}
          />
        )}

        {renderField(
          "    Amount",
          <TextInput
            placeholder="amount.."
            value={form.Amount}
            onChangeText={(text) => handleChange("Amount", text)}
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginRight: 20,
              backgroundColor: "#e6ecff",
              borderRadius: 5,
            }}
          />
        )}

        {renderField(
          "    Category",
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              marginRight: 20,
              backgroundColor: "#e6ecff",
              borderRadius: 5,
            }}
          >
            <Picker
              selectedValue={form.Category}
              onValueChange={(value) => handleChange("Category", value)}
            >
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Supplies" value="Supplies" />
              <Picker.Item label="Services" value="Services" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>
        )}

        {renderField(
          "    Type",
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              marginRight: 20,
              backgroundColor: "#e6ecff",
              borderRadius: 5,
            }}
          >
            <Picker
              selectedValue={form.Type}
              onValueChange={(value) => handleChange("Type", value)}
            >
              <Picker.Item label="Need" value="Need" />
              <Picker.Item label="Want" value="Want" />
              <Picker.Item label="Invest" value="Invest" />
            </Picker>
          </View>
        )}

        {renderField(
          "    Method",
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              marginRight: 20,
              backgroundColor: "#e6ecff",
              borderRadius: 5,
            }}
          >
            <Picker
              selectedValue={form["Payment Method"]}
              onValueChange={(value) => handleChange("Payment Method", value)}
            >
              <Picker.Item label="NEXT" value="NEXT" />
              <Picker.Item label="Bangkok Bank" value="Bangkok Bank" />
              <Picker.Item label="Seven App" value="Seven App" />
              <Picker.Item label="True Wallet" value="True Wallet" />
              <Picker.Item label="Cash" value="Cash" />
            </Picker>
          </View>
        )}

        {renderField(
          "    Note",
          <TextInput
            placeholder="note.."
            value={form.Note}
            onChangeText={(text) => handleChange("Note", text)}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginRight: 20,
              backgroundColor: "#e6ecff",
              borderRadius: 5,
            }}
          />
        )}

        {isSubmitting && (
          <Text style={{ marginVertical: 20 }}>{submitStatus}</Text>
        )}

        <View style={{ marginTop: 5, marginBottom: 20 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>บันทึก</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
