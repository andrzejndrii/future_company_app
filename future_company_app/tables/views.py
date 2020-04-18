from django.shortcuts import render
# from django.views.generic import CreateTable


def home(request):
    # context={
    #     'tables': Table.objects.all()
    # }
    return render(request, 'tables/index.html')