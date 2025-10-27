using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class MenuPrincipal : MonoBehaviour
{
    [Header("Botones del Menú")]
    public Button btnJugar;
    public Button btnOpciones;
    public Button btnPortal;
    public Button btnSalir;

    [Header("Canvas de Opciones")]
    public GameObject canvasOpciones;

    [Header("Nombre de la escena del juego")]
    public string nombreEscenaJuego = "EscenaPrincipal";

    [Header("URL del portal")]
    public string urlPortal = "localhost:5173"; 

    void Start()
    {
        btnJugar.onClick.AddListener(Jugar);
        btnOpciones.onClick.AddListener(AbrirOpciones);
        btnPortal.onClick.AddListener(AbrirPortal);
        btnSalir.onClick.AddListener(Salir);
    }

    void Jugar()
    {
        SceneManager.LoadScene(nombreEscenaJuego);
    }

    void AbrirOpciones()
    {
        if (canvasOpciones != null)
        {
            canvasOpciones.SetActive(true);
        }
        else
        {
            Debug.LogWarning("No hay Canvas de opciones asignado.");
        }
    }

    void AbrirPortal()
    {
        Application.OpenURL(urlPortal);
    }

    void Salir()
    {
        Debug.Log("Saliendo del juego...");
        Application.Quit();
    }
}
