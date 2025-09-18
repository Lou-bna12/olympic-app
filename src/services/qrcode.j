export async function getQrImageUrl(reservationId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:8000/reservations/${reservationId}/qrcode`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  //  Ne pas faire res.json() : c'est une IMAGE
  if (!res.ok) throw new Error(await res.text());

  const blob = await res.blob();           
  return URL.createObjectURL(blob);         
}
