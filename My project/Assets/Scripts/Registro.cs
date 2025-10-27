using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class RegistroManager : MonoBehaviour
{
    [Header("Campos de entrada")]
    public InputField inputNombre;
    public InputField inputCurso;
    public InputField inputContrasena;

    [Header("Botones")]
    public Button btnRegistrarse;
    public Button btnIniciarSesion;

    private void Start()
    {
        btnRegistrarse.onClick.AddListener(Registrarse);
        btnIniciarSesion.onClick.AddListener(AbrirInicioSesion);
    }

    void Registrarse()
    {
        string nombre = inputNombre.text;
        string curso = inputCurso.text;
        string contrasena = inputContrasena.text;

        PlayerPrefs.SetString("registro_nombre", nombre);
        PlayerPrefs.SetString("registro_curso", curso);
        PlayerPrefs.SetString("registro_contrasena", contrasena);
        PlayerPrefs.Save();

        SceneManager.LoadScene("InicioSesion");
    }

    void AbrirInicioSesion()
    {
        SceneManager.LoadScene("InicioSesion");
    }
}
