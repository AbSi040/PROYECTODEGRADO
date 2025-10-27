using UnityEngine;
using UnityEngine.SceneManagement;

public class EvaluarFinal : MonoBehaviour
{
    [Header("Escenas finales")]
    public string escenaFinalBueno = "FinalBueno";
    public string escenaFinalMalo = "FinalMalo";

    void Start()
    {
        DeterminarFinal();
    }

    void DeterminarFinal()
    {
        string d1 = PlayerPrefs.GetString("decision1", "");
        string d2 = PlayerPrefs.GetString("decision2", "");
        string d3 = PlayerPrefs.GetString("decision3", "");
        string d4 = PlayerPrefs.GetString("decision4", "");
        string d5 = PlayerPrefs.GetString("decision5", "");
        string d6 = PlayerPrefs.GetString("decision6", "");

        if (
            d1 == "Dar la clave" ||
            d2 == "Guardarte la información" ||
            d3 == "Ignorar el incidente y seguir la cita" ||
            d4 == "Aceptar la disculpa" ||
            d5 == "Ceder y dar las contraseñas" ||
            d6 == "Decir que sí darás la clave"
           )
        {
            SceneManager.LoadScene(escenaFinalMalo);
            return;
        }

        if (
            d3 == "Confrontar y dejar en claro límites" ||
            d4 == "Terminar la relación" ||
            d5 == "Mantener tu postura y explicar por qué" ||
            d6 == "Decir que no darás la clave"
           )
        {
            SceneManager.LoadScene(escenaFinalBueno);
            return;
        }
    }
}
