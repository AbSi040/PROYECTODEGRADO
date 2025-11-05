using System.Collections;
using UnityEngine;
using TMPro;
using UnityEngine.UI;

public class DialogoCamarasManager : MonoBehaviour
{
    [Header("Referencias UI")]
    public GameObject canvasDialogos;
    public GameObject canvasDecisiones;
    public TextMeshProUGUI textoDialogo;
    public TextMeshProUGUI nombrePersonaje;
    public Button botonContinuar;

    [Header("Configuración de diálogo")]
    [TextArea(3, 10)] public string[] dialogos;
    public string[] nombres;
    public float velocidadTexto = 0.03f;

    [Header("Cámaras o posiciones")]
    public Transform camara;
    public Transform[] posicionesCamara;

    [Header("Decisiones")]
    public string decisionElegida = ""; // aquí guardamos la opción seleccionada

    private int indice = 0;
    private bool escribiendo = false;

    void Start()
    {
        canvasDialogos.SetActive(false);
        if (canvasDecisiones != null)
            canvasDecisiones.SetActive(false);
    }

    public void IniciarDialogo()
    {
        indice = 0;
        canvasDialogos.SetActive(true);
        MostrarDialogo();
    }

    public void MostrarDialogo()
    {
        if (indice < dialogos.Length)
        {
            StopAllCoroutines();
            StartCoroutine(EfectoEscritura(dialogos[indice]));

            // Nombre del personaje
            if (nombres.Length > indice)
                nombrePersonaje.text = nombres[indice];
            else
                nombrePersonaje.text = "";

            // Cambiar cámara según quién habla
            if (posicionesCamara.Length > indice && camara != null)
            {
                camara.position = posicionesCamara[indice].position;
                camara.rotation = posicionesCamara[indice].rotation;
            }

            indice++;
        }
        else
        {
            // Fin del diálogo principal -> mostrar opciones
            canvasDialogos.SetActive(false);

            if (canvasDecisiones != null)
                canvasDecisiones.SetActive(true);
        }
    }

    IEnumerator EfectoEscritura(string texto)
    {
        escribiendo = true;
        textoDialogo.text = "";

        foreach (char letra in texto)
        {
            textoDialogo.text += letra;
            yield return new WaitForSeconds(velocidadTexto);
        }

        escribiendo = false;
    }

    public void Siguiente()
    {
        if (!escribiendo)
            MostrarDialogo();
    }

    // Método llamado desde los botones de decisión
    public void ElegirDecision(string opcion)
    {
        decisionElegida = opcion; // guarda la elección del jugador
        Debug.Log("Decisión elegida: " + decisionElegida);

        // Ocultar el canvas de decisiones
        if (canvasDecisiones != null)
            canvasDecisiones.SetActive(false);

        // Volver a iniciar los diálogos (puede ser un nuevo set según la decisión)
        if (decisionElegida == "Dar la clave")
        {
            dialogos = new string[]
            {
                "Valeria: Gracias por confiar en mí, Mateo. No te voy a fallar.",
                "Mateo: Solo espero que no me arrepienta de esto..."
            };
            nombres = new string[] { "Valeria", "Mateo" };
        }
        else if (decisionElegida == "Negarte y explicar por qué")
        {
            dialogos = new string[]
            {
                "Valeria: No se trata de no confiar, sino de respetar nuestra privacidad.",
                "Mateo: Entiendo... pero eso me hace pensar si escondes algo."
            };
            nombres = new string[] { "Mateo", "Valeria" };
        }
        else if (decisionElegida == "Evitar el tema")
        {
            dialogos = new string[]
            {
                "Mateo: Podemos hablar de esto después, ¿sí?",
                "Valeria: Siempre evitas los temas importantes..."
            };
            nombres = new string[] { "Mateo", "Valeria" };
        }

        // Reiniciar para mostrar los nuevos diálogos
        indice = 0;
        canvasDialogos.SetActive(true);
        MostrarDialogo();
    }
}
