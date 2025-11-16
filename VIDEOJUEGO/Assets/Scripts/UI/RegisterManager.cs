using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using System.Collections;
using UnityEngine.Networking;
using System.Text;

public class RegisterManager : MonoBehaviour
{
    public TMP_InputField inputNombre;
    public TMP_InputField inputContrasena;
    public TMP_InputField inputCurso;
    public TMP_InputField inputParalelo;
    public TextMeshProUGUI textoMensaje;

    private string apiURL = "http://localhost:4000/api/auth/register";

    public void OnRegisterButton()
    {
        string nombre = inputNombre.text.Trim();
        string contrasena = inputContrasena.text.Trim();
        string curso = inputCurso.text.Trim();
        string paralelo = inputParalelo.text.Trim().ToUpper();

        if (string.IsNullOrEmpty(nombre) || string.IsNullOrEmpty(contrasena))
        {
            textoMensaje.text = "Debe llenar todos los campos.";
            return;
        }

        StartCoroutine(RegistroRequest(nombre, contrasena, curso, paralelo));
    }

    IEnumerator RegistroRequest(string nombre, string contrasena, string curso, string paralelo)
    {
        RegisterData data = new RegisterData();
        data.login_nombre = nombre;
        data.password = contrasena;
        data.curso = curso;
        data.paralelo = paralelo;

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
                RegistroResponse response = JsonUtility.FromJson<RegistroResponse>(www.downloadHandler.text);

                textoMensaje.text = response.message;

                if (response.message.Contains("correctamente"))
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
    public class RegisterData
    {
        public string login_nombre;
        public string password;
        public string curso;
        public string paralelo;
    }

    [System.Serializable]
    public class RegistroResponse
    {
        public string message;
        public int id_usuario;
    }

    public void OnBackToLogin()
    {
        SceneManager.LoadScene("LoginScene");
    }
}
