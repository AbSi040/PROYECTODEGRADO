using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using System.Collections;
using UnityEngine.Networking;
using System.Text.RegularExpressions;

public class RegisterManager : MonoBehaviour
{
    public TMP_InputField inputNombre;
    public TMP_InputField inputContrasena;
    public TMP_InputField inputCurso;
    public TMP_InputField inputParalelo;
    public TextMeshProUGUI textoMensaje;

    private string apiURL = "http://127.0.0.1:4000/api/auth/register";

    public void OnRegisterButton()
    {
        string nombre = inputNombre.text.Trim();
        string contrasena = inputContrasena.text.Trim();
        string curso = inputCurso.text.Trim();
        string paralelo = inputParalelo.text.Trim().ToUpper();

        // --- VALIDACIONES ---
        // Nombre solo letras y espacios
        if (!Regex.IsMatch(nombre, @"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"))
        {
            textoMensaje.text = "El nombre solo debe contener letras (sin números ni símbolos).";
            return;
        }

        // Paralelo solo A, B o C
        if (!Regex.IsMatch(paralelo, @"^[ABC]$"))
        {
            textoMensaje.text = "El paralelo debe ser A, B o C.";
            return;
        }

        if (string.IsNullOrEmpty(contrasena))
        {
            textoMensaje.text = "Debe ingresar una contraseña.";
            return;
        }

        StartCoroutine(RegistroRequest(nombre, contrasena, curso, paralelo));
    }

    IEnumerator RegistroRequest(string nombre, string contrasena, string curso, string paralelo)
    {
        Usuario nuevoUsuario = new Usuario(nombre, contrasena, curso, paralelo);
        string jsonData = JsonUtility.ToJson(nuevoUsuario);

        using (UnityWebRequest www = UnityWebRequest.PostWwwForm(apiURL, "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                ResponseRegister response = JsonUtility.FromJson<ResponseRegister>(www.downloadHandler.text);
                textoMensaje.text = response.message;

                if (response.success)
                {
                    yield return new WaitForSeconds(1.5f);
                    SceneManager.LoadScene("LoginScene");
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
        public string curso;
        public string paralelo;

        public Usuario(string n, string c, string cu, string p)
        {
            nombre = n;
            contrasena = c;
            curso = cu;
            paralelo = p;
        }
    }

    [System.Serializable]
    public class ResponseRegister
    {
        public bool success;
        public string message;
    }

    public void OnBackToLogin()
    {
        SceneManager.LoadScene("LoginScene");
    }
}
