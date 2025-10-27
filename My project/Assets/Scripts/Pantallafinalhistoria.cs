using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class FinalHistoria : MonoBehaviour
{
    [Header("Botones")]
    public Button btnMenu;
    public Button btnSiguienteHistoria;

    [Header("Nombres de escenas")]
    public string escenaMenu = "MenuPrincipal";
    public string escenaHistoria2 = "Historia2";

    void Start()
    {
        btnMenu.onClick.AddListener(IrAlMenu);
        btnSiguienteHistoria.onClick.AddListener(IrASiguienteHistoria);
    }

    void IrAlMenu()
    {
        SceneManager.LoadScene(escenaMenu);
    }

    void IrASiguienteHistoria()
    {
        SceneManager.LoadScene(escenaHistoria2);
    }
}
