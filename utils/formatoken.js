// Function to format submission tokens
export function formatTokens(responseData) {
    return responseData.map((data) => data.token).join(",");
}