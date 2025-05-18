import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  totalSummaryContainer: {
    flexDirection: "row",
    padding: 5,
    marginTop: 25,
    backgroundColor: "#aabfff",
    borderRadius: 0,
  },
  totalText: {
    flex: 1,
    fontWeight: "bold",
  },
  totalTexthead: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 25,
  },
  emptyText: {
    marginTop: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  getstart: {
    fontSize: 20,
    textAlign: "center",
  },

  dataTableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 5,
  },
  dataTableHeader: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#d6e0ff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dataTableHeaderText: {
    flex: 1,
    fontWeight: "bold",
  },
  chartWrapper: {
    borderRadius: 16,
    marginVertical: 10,
  },
  periodPicker: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#d6e0ff",
    borderRadius: 10,
  },
  customDatePicker: {
    alignItems: "center",
    marginBottom: 10,
  },
  top3Container: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  top3Item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  top3Label: {
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 10,
    backgroundColor: "#ecf1ff",
  },
  TableContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  SelectRange: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 2,
    backgroundColor: "#d6e0ff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  HeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
    padding: 10,
  },
  BoxContainer: {
    marginTop: 5,
    backgroundColor: "#d6e0ff",
    borderRadius: 10,
  },
  BoxContainer2: {
    marginTop: 5,
    backgroundColor: "#d6e0ff",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Top3Text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  Top3Text2: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 2,
    textAlign: "center",
  },
  Top3Adjust: {
    marginBottom: 20,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;
