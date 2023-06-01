export default () => {
  console.info("SIGTERM signal received.")
  console.log("Closing http server.")
  process.exit(0)
}
