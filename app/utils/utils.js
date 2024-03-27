export const extractValue = (sortedData) => {
    let latestHeart,latestOxygen,latestTime
    for (const point of sortedData) {
        if (point.heart !== "") {
            latestHeart = String(point.heart);
            latestTime = String(point.time)
        }
        if (point.oxygen !== "") {
            latestOxygen = String(point.oxygen);
        }
        if (latestHeart !== undefined && latestOxygen !== undefined) {
            break; // Found both latest values, exit loop
        }
    }
    return [latestHeart, latestOxygen,latestTime]
}

export function parseData(data) {
    return data.map(item => {
        const newItem = {};
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            newItem[key] = typeof item[key] === 'bigint' ? Number(item[key]) : item[key];
          }
        }
        return newItem;
      });
  }

export function parseDataByKey(dataset, key) {
    const keyMap = { heart: "heart", o2: "oxygen" }; // Mapping input key to actual data keys
    const actualKey = keyMap[key];
  
    if (!actualKey) {
      console.error("Invalid key. Use 'heart' or 'o2'.");
      return [];
    }
    return dataset
      .filter(entry => entry[actualKey] !== "") // Filter out entries without a value for the key
      .map(entry => ({
        value: entry[actualKey],
        time: entry.time
      }));
  }

export function formatDate(dateString, formatType) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMilliseconds = now - date;
  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

  if (formatType === 'minutesAgo') {
    return `${diffMinutes} minutes ago`;
  } else if (formatType === 'customFormat') {
    const formattedDate = date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
    return formattedDate;
  } else {
    return 'Invalid format type';
  }
}