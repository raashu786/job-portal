const formatData = (dateString: string) => {
    const date = new Date(dateString);
    const options ={year:"numeric" as const, month:"short" as const}
    return date.toLocaleString("en-US", options);
}
function timeAgo(timestamp: string) {
    const posted = new Date(timestamp).getTime(); // Convert input timestamp to milliseconds
    const now = new Date().getTime(); // Get current time in milliseconds
    const diff = (now - posted) / 1000; // Convert milliseconds to seconds

    if (diff < 60) {
        return Math.floor(diff) + " seconds ago";
    }

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) {
        return minutes + " minutes ago";
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return hours + " hours ago";
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
        return days + " days ago";
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return months + " months ago";
    }

    const years = Math.floor(months / 12);
    return years + " years ago";
}

const getBase64=(file:any)=>{
    return new Promise((resolve, reject)=>{
      const reader=new FileReader();
      reader.readAsDataURL(file);
      reader.onload=()=>resolve(reader.result);
      reader.onerror=error=>reject(error);
    })
  }
  const formatInterViewTime = (isoString: string): string => {
    const date = new Date(isoString);
  
    const options: Intl.DateTimeFormatOptions = { 
      day: "numeric", 
      month: "long", 
      year: "numeric", 
      hour: "numeric", 
      minute: "2-digit", 
      hour12: true 
    };
  
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const base64ToPdf = (base64: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  };
export {formatData,timeAgo ,getBase64,formatInterViewTime,base64ToPdf}