using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using System.Collections;
using UnityEngine.Networking;

public class LoginManager : MonoBehaviour
{
    [Header("Campos de Entrada")]
    public TMP_InputField inputNombre;
    public TMP_InputField inputContrasena;

    [Header("Mensajes")]
    public TextMeshProUGUI textoMensaje;

    private string apiURL = "http://localhost:4000/api/auth/login";


    public void OnLoginButton()
    {
        string nombre = inputNombre.text.Trim();
        string contrasena = inputContrasena.text.Trim();

        if (string.IsNullOrEmpty(nombre) || string.IsNullOrEmpty(contrasena))
        {
            textoMensaje.text = "Por favor complete todos los campos.";
            return;
        }

        StartCoroutine(LoginRequest(nombre, contrasena));
    }

    IEnumerator LoginRequest(string nombre, string contrasena)
    {
        // Crear el JSON
        string jsonData = JsonUtility.ToJson(new Usuario(nombre, contrasena));

        using (UnityWebRequest www = UnityWebRequest.PostWwwForm(apiURL, "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                ResponseLogin response = JsonUtility.FromJson<ResponseLogin>(www.downloadHandler.text);

                if (response.success)
                {
                    textoMensaje.text = "Inicio de sesión correcto.";
                    PlayerPrefs.SetString("Usuario", response.nombre);
                    yield return new WaitForSeconds(1f);
                    SceneManager.LoadScene("MainMenuScene");
                }
                else
                {
                    textoMensaje.text = response.message;
                }
            }
            else
            {
                textoMensaje.text = "Error de conexión con el servidor.";
            }
        }
    }

    [System.Serializable]
    public class Usuario
    {
        public string nombre;
        public string contrasena;
        public Usuario(string n, string c) { nombre = n; contrasena = c; }
    }

    [System.Serializable]
    public class ResponseLogin
    {
        public bool success;
        public string message;
        public string nombre;
    }

    public void OnRegisterButton()
    {
        SceneManager.LoadScene("RegisterScene");
    }
}
