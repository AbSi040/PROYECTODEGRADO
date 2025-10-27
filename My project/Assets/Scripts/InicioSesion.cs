using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class LoginManager : MonoBehaviour
{
    [Header("Campos de entrada")]
    public InputField inputNombre;
    public InputField inputContrasena;

    [Header("Botones")]
    public Button btnIniciarSesion;
    public Button btnRegistrarse;

    private void Start()
    {
        btnIniciarSesion.onClick.AddListener(IniciarSesion);
        btnRegistrarse.onClick.AddListener(AbrirRegistro);
    }

    void IniciarSesion()
    {
        string nombre = inputNombre.text;
        string contrasena = inputContrasena.text;

        PlayerPrefs.SetString("usuario_nombre", nombre);
        PlayerPrefs.SetString("usuario_contrasena", contrasena);
        PlayerPrefs.Save();

        SceneManager.LoadScene("MenuPrincipal");
    }

    void AbrirRegistro()
    {
        SceneManager.LoadScene("Registro");
    }
}
