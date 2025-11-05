using UnityEngine;

public class CinematicaInicio : MonoBehaviour
{
    public GameObject canvasCinematica;   // Canvas inicial
    public DialogoCamarasManager dialogoManager; // Script del CanvasDialogos

    public void IniciarCinematica()
    {
        if (canvasCinematica != null)
            canvasCinematica.SetActive(false);

        if (dialogoManager != null)
        {
            dialogoManager.canvasDialogos.SetActive(true);
            dialogoManager.IniciarDialogo();
        }
    }
}
