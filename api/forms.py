from django import forms
from .models import Product, Transaction

class ProductPurchaseForm(forms.Form):
    product = forms.ModelChoiceField(
        queryset=Product.objects.all(),
        empty_label="Select a product"
    )
    quantity = forms.IntegerField(min_value=1)
    payment_method = forms.ChoiceField(choices=Transaction.PAYMENT_METHODS)

    def clean(self):
        cleaned_data = super().clean()
        product = cleaned_data.get('product')
        quantity = cleaned_data.get('quantity')

        if product and quantity:
            if product.quantity < quantity:
                raise forms.ValidationError(
                    f"Only {product.quantity} units available for {product.name}"
                )
        return cleaned_data

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'price', 'quantity']
        widgets = {
            'price': forms.NumberInput(attrs={'step': '0.01'}),
        } 