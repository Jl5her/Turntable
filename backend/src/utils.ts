export const log = (message: string) => {
  const timestamp = (new Date()).toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'America/Chicago'
  })

  console.log(`[${timestamp}] ${message}`)
}