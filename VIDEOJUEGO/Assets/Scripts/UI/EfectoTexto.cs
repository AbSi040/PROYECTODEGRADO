using System.Collections;
using UnityEngine;
using TMPro; // Necesario si usas TextMeshPro

public class EfectoTexto : MonoBehaviour
{
    public TextMeshProUGUI texto; // arrastra aquí tu texto del Canvas
    public float velocidad = 0.03f; // velocidad de escritura
    private string textoCompleto;

    void Start()
    {
        textoCompleto = texto.text;
        texto.text = "";
        StartCoroutine(MostrarTexto());
    }

    IEnumerator MostrarTexto()
    {
        foreach (char letra in textoCompleto)
        {
            texto.text += letra;
            yield return new WaitForSeconds(velocidad);
        }
    }

    public void ReiniciarTexto()
    {
        StopAllCoroutines();
        texto.text = "";
        StartCoroutine(MostrarTexto());
    }
}
