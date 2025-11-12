using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;
using UnityEngine.Networking;

public class CanvasDecisionManager : MonoBehaviour
{
    [Header("Canvases de decisiones")]
    public GameObject canvaDecision1;
    public GameObject canvaRamaA;
    public GameObject canvaRamaB;
    public GameObject canvaRamaC;
    public GameObject canvaRamaA1;
    public GameObject canvaRamaDA1;
    public GameObject canvaFinalBueno;
    public GameObject canvaFinalMalo;

    [Header("Mensaje de estado")]
    public TextMeshProUGUI mensajeTexto;

    private string apiURL = "http://localhost:4000/api/decisiones"; // Ruta backend
    private string historia = "HISTORIA_1"; // Nombre de la historia
    private GameObject canvaActual;

    void Start()
    {
        // Solo mostrar el primer Canvas
        MostrarSolo(canvaDecision1);
    }

    // 🔹 Muestra únicamente el Canvas seleccionado
    public void MostrarSolo(GameObject nuevoCanvas)
    {
        canvaDecision1.SetActive(false);
        canvaRamaA.SetActive(false);
        canvaRamaB.SetActive(false);
        canvaRamaC.SetActive(false);
        canvaRamaA1.SetActive(false);
        canvaRamaDA1.SetActive(false);
        canvaFinalBueno.SetActive(false);
        canvaFinalMalo.SetActive(false);

        nuevoCanvas.SetActive(true);
        canvaActual = nuevoCanvas;
    }

    // ======================================================
    // 🔹 DECISIONES PRINCIPALES (Primera pantalla)
    // ======================================================
    public void ElegirRamaA() => TomarDecision("DEC1_A", canvaRamaA);  // Dar la clave
    public void ElegirRamaB() => TomarDecision("DEC1_B", canvaRamaB);  // Negarse
    public void ElegirRamaC() => TomarDecision("DEC1_C", canvaRamaC);  // Evitar tema

    // ======================================================
    // 🔹 RAMA A (tras dar la clave)
    // ======================================================
    public void ElegirRamaA1() => TomarDecision("DEC2_A1", canvaRamaA1); // Confrontar
    public void ElegirA_FMalo() => TomarDecision("DEC2_A2", canvaFinalMalo); // Guardarse → Final malo

    // ======================================================
    // 🔹 RAMA A1
    // ======================================================
    public void ElegirRamaDA1() => TomarDecision("DEC3_DA1", canvaRamaDA1); // Poner límites
    public void ElegirA1_FMalo() => TomarDecision("DEC3_EA1", canvaFinalMalo); // Ignorar → Final malo

    // ======================================================
    // 🔹 RAMA DA1
    // ======================================================
    public void ElegirFinalBueno() => TomarDecision("FINAL_BUENO", canvaFinalBueno);
    public void ElegirFinalMalo() => TomarDecision("FINAL_MALO", canvaFinalMalo);

    // ======================================================
    // 🔹 RAMA B (Negarse)
    // ======================================================
    public void RamaB_FBueno() => TomarDecision("DEC4_HB", canvaFinalBueno);
    public void RamaB_FMalo() => TomarDecision("DEC4_IB", canvaFinalMalo);

    // ======================================================
    // 🔹 RAMA C (Evitar tema)
    // ======================================================
    public void RamaC_FBueno() => TomarDecision("DEC5_JC", canvaFinalBueno);
    public void RamaC_FMalo() => TomarDecision("DEC5_KC", canvaFinalMalo);

    // ======================================================
    // 🔹 FUNCIÓN GENERAL DE GUARDADO
    // ======================================================
    private void TomarDecision(string idDecision, GameObject siguienteCanvas)
    {
        string jugador = PlayerPrefs.GetString("Usuario", "");

        if (string.IsNullOrEmpty(jugador))
        {
            mensajeTexto.text = "⚠️ No hay usuario activo.";
            Debug.LogWarning("No hay usuario activo.");
            return;
        }

        StartCoroutine(GuardarDecision(jugador, historia, idDecision, siguienteCanvas));
    }

    IEnumerator GuardarDecision(string nombreJugador, string historia, string idDecision, GameObject siguienteCanvas)
    {
        DecisionData data = new DecisionData(nombreJugador, historia, idDecision);
        string jsonData = JsonUtility.ToJson(data);

        using (UnityWebRequest www = new UnityWebRequest(apiURL, "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            www.uploadHandler = new UploadHandlerRaw(bodyRaw);
            www.downloadHandler = new DownloadHandlerBuffer();
            www.SetRequestHeader("Content-Type", "application/json");

            yield return www.SendWebRequest();

            if (www.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"✅ Decisión guardada ({idDecision}) por {nombreJugador}");
                mensajeTexto.text = "";
                MostrarSolo(siguienteCanvas);
            }
            else
            {
                Debug.LogError("⚠️ Error al guardar decisión: " + www.error);
                mensajeTexto.text = "Error al guardar la decisión.";
            }
        }
    }

    // ======================================================
    // 🔹 Estructura de datos
    // ======================================================
    [System.Serializable]
    public class DecisionData
    {
        public string nombreUsuario;
        public string historia;
        public string idDecision;

        public DecisionData(string usuario, string historia, string decision)
        {
            this.nombreUsuario = usuario;
            this.historia = historia;
            this.idDecision = decision;
        }
    }
}
