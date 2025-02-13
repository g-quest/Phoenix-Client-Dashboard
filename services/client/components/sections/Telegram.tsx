export default function SectionTelegram() {
  function getPastTimestamps() {
    const today = new Date()

    // Helper function to subtract days and return a Unix timestamp
    function subtractDaysAndGetTimestamp(date, days) {
      const result = new Date(date)
      result.setDate(result.getDate() - days)
      return Math.floor(result.getTime() / 1000) // Convert milliseconds to seconds
    }

    const sevenDaysAgoTimestamp = subtractDaysAndGetTimestamp(today, 7)
    const thirtyDaysAgoTimestamp = subtractDaysAndGetTimestamp(today, 30)
    const ninetyDaysAgoTimestamp = subtractDaysAndGetTimestamp(today, 90)

    return {
      todayTimestamp: Math.floor(today.getTime() / 1000),
      sevenDaysAgoTimestamp,
      thirtyDaysAgoTimestamp,
      ninetyDaysAgoTimestamp,
    }
  }

  console.log(getPastTimestamps())
  return <div>Telegram</div>
}
