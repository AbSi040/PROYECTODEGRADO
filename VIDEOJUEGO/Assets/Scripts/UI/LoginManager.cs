using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using System.Collections;
using UnityEngine.Networking;
using System.Text;

public class LoginManager : MonoBehaviour
{
    public TMP_InputField inputNombre;
    public TMP_InputField inputContrasena;
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
        LoginData data = new LoginData();
        data.login_nombre = nombre;
        data.password = contrasena;

        string jsonData = JsonUtility.ToJson(data);

        using (UnityWebRequest www = new UnityWebRequest(apiURL, "POST"))
        {
            byte[] raw = Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(raw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                LoginResponse response = JsonUtility.FromJson<LoginResponse>(www.downloadHandler.text);

                if (!string.IsNullOrEmpty(response.token))
                {
                    // Guardar datos importantes
                    PlayerPrefs.SetString("token", response.token);
                    PlayerPrefs.SetInt("id_usuario", response.id_usuario);
                    PlayerPrefs.SetString("usuario", response.login_nombre);
                    PlayerPrefs.SetString("codigo_anonimo", response.codigo_anonimo);

                    textoMensaje.text = "Inicio de Sesión Correcto";
                    yield return new WaitForSeconds(1f);
                    SceneManager.LoadScene("MainMenuScene");
                }
                else
                {
                    textoMensaje.text = "Credenciales inválidas";
                }
            }
            else
            {
                textoMensaje.text = "Error de conexión con el servidor.";
            }
        }
    }

    [System.Serializable]
    public class LoginData
    {
        public string login_nombre;
        public string password;
    }

    [System.Serializable]
    public class LoginResponse
    {
        public string token;
        public int id_usuario;
        public string login_nombre;
        public string codigo_anonimo;
        public string rol;
    }

    public void OnRegisterButton()
    {
        SceneManager.LoadScene("RegisterScene");
    }
}
