from django.shortcuts import render

def lobby(request):
    return render(request, 'service/streamer.html')

def client(request):
    return render(request, 'service/client.html')
