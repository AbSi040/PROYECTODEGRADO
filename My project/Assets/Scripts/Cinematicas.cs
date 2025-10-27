using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class TypewriterEffect : MonoBehaviour
{
    public float typingSpeed = 0.05f;
    public Text textComponent;
    private string fullText;

    void Start()
    {
        fullText = textComponent.text;
        textComponent.text = "Eres una estudiante de la carrera de administración de empresas y " +
            "\r\nllevas de pareja con Mateo, un chico de la carrera de Medicina, \r\nbastante popular " +
            "en su clase por ser atractivo. Llevas con él\r\npor tres meses, la relación va bien hasta que un día,\r\npasa algo en el receso...";
        StartCoroutine(TypeText());
    }

    IEnumerator TypeText()
    {
        foreach (char letter in fullText)
        {
            textComponent.text += letter;
            yield return new WaitForSeconds(typingSpeed);
        }
    }
}

