export default function ({ route, redirect }) {
  // Define the base URL of your Firebase project
  const firebaseBaseUrl = "https://datasets.filecoin.io";

  // Redirect to the corresponding Firebase URL
  return redirect(301, `${firebaseBaseUrl}${route.path}`);
}
