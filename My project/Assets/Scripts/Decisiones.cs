using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class DecisionManager : MonoBehaviour
{
    [Header("Botones de decisión")]
    public Button btnOpcion1; 
    public Button btnOpcion2; 
    public Button btnOpcion3; 

    [Header("Ramas")]
    public string escenaRamaA = "RamaA";
    public string escenaRamaB = "RamaB";
    public string escenaRamaC = "RamaC";

    private void Start()
    {
        btnOpcion1.onClick.AddListener(Opcion1);
        btnOpcion2.onClick.AddListener(Opcion2);
        btnOpcion3.onClick.AddListener(Opcion3);
    }

    void Opcion1()
    {
        PlayerPrefs.SetString("decision1", "Dar la clave");
        PlayerPrefs.Save();
        SceneManager.LoadScene(escenaRamaA);
    }

    void Opcion2()
    {
        PlayerPrefs.SetString("decision2", "Negarte y explicar por qué");
        PlayerPrefs.Save();
        SceneManager.LoadScene(escenaRamaB);
    }

    void Opcion3()
    {
        PlayerPrefs.SetString("decision3", "Evitar el tema");
        PlayerPrefs.Save();
        SceneManager.LoadScene(escenaRamaC);
    }
}
