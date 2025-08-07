#!/bin/bash

: '
  ToDo:
  - Create a function to messages (windows)
    - title boxes windows

'

red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
blue='\033[0;34m'
magenta='\033[0;35m'
cyan='\033[0;36m'
# Clear the color after that
clear='\033[0m'

# ------------------------------------------------------------------------------------------------------------------

WORKSPACE_PATH=$HOME/workspace
MAMBA_PATH=$WORKSPACE_PATH/pos-mamba
procThreadCount_1=$(( $(nproc --all) -1 ))


# ------------------------------------------------------------------------------------------------------------------
# 
# $1 = char
# $2 = multiplo
repeteExpr(){
    local str=$1
    local rpt=$2
    if [[ -z "$rpt" ]]; then
        rpt=$str
        str=" "
    fi
    local mult=""
    if [[ $rpt != 0 ]]; then
        mult=$(printf "%0.s$str" $(seq 1 $rpt)) # Repete expressao $1 por $2 vezes
    fi
    echo "$mult"
}



# Passar vetor de strings de mensagens
msgBox(){
    local msgArr=("$@")

    local isWarning=false
    if [[ ${msgArr[0]} == "!" ]]; then
        isWarning=true
        unset msgArr[0]
    fi

    # find max
    local max=0
    for val in "${msgArr[@]}"
    do
        local sz=${#val}
        max=$((max>sz ? max : sz))
    done

    local Hbot="$(repeteExpr "═" $(($max+2)))"
    if [[ $isWarning == true ]]; then
        local Htop=$(repeteExpr "═" $(($max+2-6)))
        echo -e "${green}╔═${red}!!!!!${green}$Htop╗${clear}"
    else
        echo -e "${green}╔$Hbot╗${clear}"
    fi


    for val in "${msgArr[@]}"
    do
        sz=${#val}
        local sz2=$(($max-$sz))
        local Sp=$(repeteExpr " " $sz2)
        echo -e "${green}║${clear} $val$Sp ${green}║${clear}"
    done

    echo -e "${green}╚$Hbot╝${clear}"
    echo ""
}

msgBoxEnter(){
    declare -a msgArr=("$@")
    msgArr+=(" >> Enter para continuar...")
    msgBox "${msgArr[@]}"
    read -p ""
}


# ------------------------------------------------------------------------------------------------------------------
# adiciona as chaves e baixa os pacotes
addKeys(){
    msgBox "Adding keys for Azure and others"
    local ARCH=$(dpkg --print-architecture)
    local DISTRO=$(lsb_release -cs)

    sudo mkdir -p /etc/apt/keyrings
    sudo install -m 0755 -d /etc/apt/keyrings

    # docker key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$ARCH signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $DISTRO stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # microsoft Azure key
    curl -sLS https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /etc/apt/keyrings/microsoft.gpg > /dev/null
    sudo chmod go+r /etc/apt/keyrings/microsoft.gpg
    echo "deb [arch=$ARCH signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/azure-cli/ $DISTRO main" | \
    sudo tee /etc/apt/sources.list.d/azure-cli.list > /dev/null
}


# ------------------------------------------------------------------------------------------------------------------
# Instalação de pacotes
installBasicPackages() {
    msgBox "Executando:" \
           " - Configurações básicas de sistema" \
           " - Instalação de pacotes essenciais" \
           "      --------------------         " \
           " Aguarde, pode demorar!"

    if [ -f /etc/apt/trusted.gpg ]; then
        sudo cp /etc/apt/trusted.gpg /etc/apt/trusted.gpg.d
    fi

    # Gertecs
    sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test   || exit
    sudo add-apt-repository -y ppa:linuxuprising/libpng12

    sudo apt update

    # Ensure last kernel version for Ubuntu:  https://bugs.launchpad.net/ubuntu/+source/linux-hwe-6.5/+bug/2069288
    sudo apt install linux-generic-hwe-22.04 -y
    sudo apt install gcc-12 -y || exit
    sudo ln -s -f   /usr/bin/gcc-12   /usr/bin/gcc

    sudo apt dist-upgrade -y

    # essential packages
    sudo apt install -y \
                build-essential sshpass at jq moreutils jo \
                default-jre  jq  android-tools-adb \
                sqlite3 libsqlite3-dev  \
                gcc-multilib g++-multilib gdb gdbserver \
                git cmake coreutils ccache \
                curl  minicom \
                python3  python3-pip \
                lcov  ca-certificates \
                speech-dispatcher \
                clang-tidy  clang-tools  clang-format  clang-format-15 \
                || exit

    # Gertecs
    sudo apt install -y \
                 android-tools-adb autoconf gperf bison flex libtool \
                 unzip default-jre libstdc++6 \
                 libfuse-dev libpng12-0 pkg-config \
                 || exit
    sudo apt remove -y modemmanager
    



    # need for installation
    sudo apt install -y \
                snapd  xclip \
                || exit

    # other very useful packages
    sudo apt install -y \
                net-tools openssh-server\
                ninja-build unzip \
                || exit
                # qtbase5-dev   qtchooser   qt5-qmake   qtbase5-dev-tools \
                # gnupg apt-transport-https lsb-release \
                # cmake-format cgroupfs-mount \
                # autoconf automake libtool flex bison \
                # lm-sensors bzr gvfs \
                # gperf   \
                # cppcheck pavucontrol libappindicator3-1 \
                # libnl-3-dev  libsdl1.2-dev libsdl2-dev \

    #sudo snap install  slack

    addKeys
    sudo apt update

    # Cleaning:
    sudo apt install -f
    sudo apt autoremove -y
    sudo apt autoclean

    # installs nvm (Node Version Manager)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
    # download and install Node.js (you may need to restart the terminal)
    nvm install 16
    # verifies the right Node.js version is in the environment
    node -v # should print `v16.20.2`
    # verifies the right npm version is in the environment
    npm -v # should print `8.19.4`

    pip3 install   defusedxml gitpython pygithub requests # Mamba
    pip3 install   psutil pyserial                        # Toninho
}

# ------------------------------------------------------------------------------------------------------------------
# Configuração do GitHub
configGithub(){
    msgBox "Configurando o GitHub..."

    read -p "Digite seu email corporativo: " email
    echo ""

    msgBoxEnter "O browser será aberto. Por favor, faça login em sua conta Github"
    xdg-open https://github.com/login     1> /dev/null 2>&1
    msgBoxEnter "Pressione ENTER após fazer login..."

    msgBoxEnter "Para as próximas perguntas, basta dar enter:"

    ssh-keygen -t ed25519 -C "$email"
    eval "$(ssh-agent -s)"
    # copia os dados da chave para serem adicionados em sua conta do GH
    xclip -sel clip < ~/.ssh/id_ed25519.pub

    msgBoxEnter "A chave será criada e copiada."           \
                "Aguarde o browser será aberto em seguida" \
                "Basta usar CTRL+V no Github para colar"
    xdg-open https://github.com/settings/ssh/new     1> /dev/null 2>&1
    msgBoxEnter "Pressione ENTER após adicionar a chave em sua conta..."

    msgBoxEnter "Lembre de autorizar o SSO da nova chave adicionada..." \
                "O Browser será novamente aberto"
    xdg-open https://github.com/settings/ssh      1> /dev/null 2>&1
    msgBoxEnter "Pressione ENTER para concluir..."
}

# ------------------------------------------------------------------------------------------------------------------
# Logs in on azure if necessary
azurePrepare(){
    local extension=$(az extension list | grep "cliextensions/azure-devops")
    if [ "$extension" == "" ] ; then
         az extension add --name azure-devops
    fi

    local status=$(az account list | grep "Enabled")
    if [ "$status" == "" ] ; then
        msgBoxEnter "O browser será aberto, efetue o login para prosseguir!"
        az login --allow-no-subscriptions
    fi
}

# ------------------------------------------------------------------------------------------------------------------
# Adiciona token de github
stone_dev_ini(){
    if [ -d "$MAMBA_PATH" ]; then
        # Caminho para a pasta onde o arquivo será criado
        local devTools=$MAMBA_PATH/devtools

        # Nome do arquivo
        local stoneDevIni=".stonedev.ini"

        # Caminho completo para o arquivo
        local file_path="$devTools/$stoneDevIni"

        msgBox "Cole aqui, em seguida, o token do Github."  \
               "Normalmente você deveria já ter o seu token anotado!"  \
               "Você pode gerar o seu aqui: https://github.com/settings/tokens"
        echo "> _"

        read GHTOKEN

        echo "Token Github: " $GHTOKEN

        local APPS_PATH=$MAMBA_PATH/apps
        # Defina o conteúdo do arquivo stonedev.ini
        local stoneDevIni_content=("[GITHUB]"\
                                   "GITHUB_TOKEN=$GHTOKEN"\
                                   "[REPO]"\
                                   "APPS_PATH=$APPS_PATH")

        # Cria o arquivo com o conteúdo especificado
        printf "%s\n" ${stoneDevIni_content[@]} > $file_path
        echo "Arquivo $stoneDevIni criado em $devTools"
    fi
}

# ------------------------------------------------------------------------------------------------------------------
# Clonagem de repositório
cloneRepos() {
    if [ ! -d "$WORKSPACE_PATH" ]; then
        msgBox "Criando o diretório $WORKSPACE_PATH ..."
        mkdir -p "$WORKSPACE_PATH"
    fi

    cd $WORKSPACE_PATH || exit

 
    msgBox "Clonando repositórios..."

    msgBox "Clonando repositório Mamba" \
           "Se houver pergunta sobre chave ED25519, escreva 'yes'"
    git clone --progress --recurse-submodules git@github.com:stone-payments/pos-mamba.git

    msgBox "Clonando repositório pos-newton"
    git clone --progress --recurse-submodules git@github.com:stone-payments/pos-newton.git

    msgBox "Clonando repositório pos-pax-monitor-lite"
    git clone --progress --recurse-submodules git@github.com:stone-payments/pos-pax-monitor-lite.git
    

    cd $MAMBA_PATH || exit

    msgBox "Checking out develop branch..."
    git checkout develop

    msgBox "Executando git hooks..."
    _git_hooks/install-hooks.sh

    msgBox "Inicializando repositório git Mamba..."
    wget -O - https://raw.githubusercontent.com/stone-payments/pos-mamba-sdk/master/tools/repo_initialization.sh | bash



    msgBox "Configurando devtools ..."
    stone_dev_ini


    msgBox "Compilando o Mamba pela primeira vez!" "POS alvo: S920"
    echo "Usando $procThreadCount_1 threads"
    sleep 5
    devtools/mbs/mbs.py   --device s920   --pack dev   --org stone  --threads $procThreadCount_1  ||  exit
    msgBox "Build de sucesso!!"
}

# ------------------------------------------------------------------------------------------------------------------
installMambaDesktop(){
    cd $MAMBA_PATH || exit

    msgBox "Instalando pacotes básicos para Mamba Desktop"

    # https://github.com/stone-payments/pos-mamba/pull/5595
    sudo apt install -y \
        libssl-dev \
        libarchive-dev \
        libmxml-dev         libtinyxml2-dev \
        libasound2-dev \
        libnl-route-3-dev \
        libpng16-16  libpng-dev \
        libfreetype6 libfreetype6-dev \
        libsdl1.2-compat-dev \
        libbz2-dev \
        libpcre2-dev libgl1-mesa-dev \
        || exit
        # libcanberra-gtk-module   
        #  libreadline-dev \
        #  \

    msgBox "Compilando o Mamba Desktop"
    echo "Usando $procThreadCount_1 threads"
    sleep 5
    
    devtools/mbs/mbs.py   --device desktop   --pack dev   --threads $procThreadCount_1  ||  exit
    msgBox "Build de sucesso!"

    msgBoxEnter "Executando Mamba Desktop..." "Duas telas serão abertas em caso de Sucesso." "Você pode fechar em seguida para continuar."
    ./output/install/LINUX_DESKTOP_QT4/StoneMambaSystem -qws child

    msgBoxEnter "Em seguida, vamos buildar e rodar os Testes Unitários." "Este passo será um pouco mais demorado"
    devtools/mbs/mbs.py   --device desktop   --pack dev   --threads $procThreadCount_1  --config build_tests  ||  exit
    ./scripts/environment_and_tests/runTests.sh -t || exit


    ./scripts/runMambaDesktop.sh 
}

# ------------------------------------------------------------------------------------------------------------------
# Download do Qt Creator
installQtCreator() {
    msgBox "Você já possui licença Qt da Stone? <s/n>"
    local qtLicense=""
    read qtLicense
    if [[ $qtLicense == n ]]; then
        msgBoxEnter "O browser será aberto. Por favor, crie uma licença do Qt" \
                    ""
        xdg-open https://login.qt.io/register     1> /dev/null 2>&1
    fi


    # https://stackoverflow.com/questions/68036484/qt6-qt-qpa-plugin-could-not-load-the-qt-platform-plugin-xcb-in-even-thou
    # https://forum.qt.io/topic/148036/qt-installation-is-missing-libxcb/2z2111111
    # it was missing for execute QtCreator. review in the future.
    sudo apt install \
        libxcb-cursor0 \
        libxcb-keysyms1 \
        libxcb-icccm4 \
        libxkbcommon-x11-0 \
        ||  exit

    msgBox "O instalador online está sendo baixado e será executado em breve." \
           ""                                                                  \
           "Na ferramenta gráfica, faça login com sua conta e prossiga com a instalação." \
           "   Opção 'Custom Installation'"                                    \
           ""                                                                  \
           "Na etapa 'Select Components':"                                     \
           "   1. Deixar marcado apenas 'LTS'"                                 \
           "   2. Clicar 'Filtro'"                                             \
           "   3. Instale ao menos os compiladores (opção 'gcc' ou 'desktop' dentro de cada kit), dos seguintes kits:"                             \
           "         - 6 (maior versão)"                                       \
           "         - 5 (maior versão)"                                       \
           "   4. No grupo 'Qt Design Studio', pode desmarcar. Não é usado" \
           "   5. No grupo 'Qt/Developer and Design Tools' instale ao menos o Qt Creator (costuma estar selecionado)"                \
           "   6. Avançar/avançar/avançar/esperar downloads/esperar instalação..."

    # https://d13lb3tujbc8s0.cloudfront.net/onlineinstallers/qt-unified-linux-x64-4.6.1-online.run
    # um link oficial:
    #   http://www.nic.funet.fi/pub/mirrors/download.qt-project.org/archive/online_installers/4.6/
    #   http://www.nic.funet.fi/pub/mirrors/download.qt-project.org/archive/online_installers/4.6/qt-unified-linux-x64-4.6.1-online.run
    #   tirado daqui: https://www.qt.io/blog/qt-online-installer-4.0.1-1-released
    wget https://download.qt.io/official_releases/online_installers/qt-unified-linux-x64-online.run

    chmod +x qt-unified-linux-x64-online.run
    ./qt-unified-linux-x64-online.run
    rm qt-unified-linux-x64-online.run

    ## Criacao de kits
    # 
}

# ------------------------------------------------------------------------------------------------------------------
addSshConfig(){
    local config_file=~/.ssh/config
    if [ ! -f "$config_file" ]; then
    echo "
host pax
    User MAINAPP
    PubkeyAcceptedAlgorithms=+ssh-rsa
    HostKeyAlgorithms=+ssh-rsa
    StrictHostKeyChecking=no
    hostname localhost
    IdentityFile /home/user/.ssh/id_rsa_pax
    PreferredAuthentications publickey
    RemoteCommand cd /data/app/MAINAPP && LD_LIBRARY_PATH=/data/app/MAINAPP/lib exec ash
    RequestTTY yes
    Port 51000


Host pax_sshfs
    User MAINAPP
    PubkeyAcceptedAlgorithms=+ssh-rsa
    HostkeyAlgorithms=+ssh-rsa
    StrictHostKeyChecking=no
    hostname localhost
    IdentityFile ~/.ssh/id_rsa_pax
    RequestTTY yes
    Port  51000
" >> "$config_file"
   fi
}

# ------------------------------------------------------------------------------------------------------------------
installPaxDriver(){
    cd $MAMBA_PATH
    git checkout develop

    msgBox  "!"   "Conecte seu POS PAX a uma porta USB!"
    while true; do
        local pospax=""
        if   lsusb | grep -q    -e "s920"    -e "S920"; then
            pospax=s920
        elif lsusb | grep -q    -e "q92"     -e "Q92" ; then
            pospax=q92
        elif lsusb | grep -q    -e "d230"    -e "D230"; then
            pospax=d230
        elif lsusb | grep -q    -e "d199"    -e "D199"; then
            pospax=d199
        elif lsusb | grep -q    -e "d195"    -e "d195"; then
            pospax=d195
        else
            echo "aguardando..."
            sleep 5
            continue
        fi

        msgBox "POS PAX Encontrado: " "==> $pospax <=="

        # instalar novos comandos
        source "cli/${pospax}.sh"

        installEverything
        xcbStart

        # isto eh temporario, para atualizar o path para o xcb, dentro do atual shell
        source ~/.bashrc

#       addSshConfig
        break
    done
}

# ------------------------------------------------------------------------------------------------------------------
installDockerImage(){
    while true; do
        read -p "Deseja continuar? (S/N): " choice
        case $choice in
            S|s )
                if [ -d "$MAMBA_PATH" ]; then
                    local DOCKER_SCRIPT=$MAMBA_PATH/devtools/docker/buildDockerImage.sh
                    if [ -f "$DOCKER_SCRIPT" ]; then

                        sudo apt install -y \
                            docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin \
                            azure-cli  \
                          || exit


                        # https://medium.com/@praveenadoni4456/error-got-permission-denied-while-trying-to-connect-to-the-docker-daemon-socket-at-e68bfab8146a
                        sudo usermod -aG docker ${USER}
                        sudo chmod 666 /var/run/docker.sock
                        sudo systemctl restart docker

                        azurePrepare
                        $DOCKER_SCRIPT $MAMBA_PATH  ||  exit

                        $MAMBA_PATH/scripts/cmm.sh   --device desktop   --pack dev   --threads $procThreadCount_1   --rebuild   ||  exit
                    else
                        msgBox  "!"   "Script de instalação do docker não encontrado! (${DOCKER_SCRIPT})"
                    fi
                else
                    msgBox  "!"   "    Diretório pos-mamba não encontrado!" \
                                  "Execute o passo c. - Clonagem de repositório"
                fi
                break
                ;;
            N|n )
                echo "Saindo...."
                break
                ;;
            * )
                echo "Opção inválida. Digite S para continuar ou N para sair."
                ;;
        esac
    done
}

# ------------------------------------------------------------------------------------------------------------------
config_ccache(){
    # Crie o diretório .ccache se ele ainda não existir
    # https://github.com/stone-payments/pos-mamba/wiki/Using-the-ccache-compiler-cache-in-local-development-environment
    mkdir -p $HOME/.ccache
    export CCACHE_DIR=$HOME/.ccache

    # Crie o arquivo ccache.conf com o conteúdo desejado
    echo -e "# Max cache size. Ideally it should be big enough to support different platforms/toolchains\n" \
            "max_size = 16G\n" \
            "\n" \
            "# Don't take into account the full path where each source file is located. It is useful so that caches\n" \
            "# from different mamba clones can accelerate one another. It requires additional configuration to work,\n" \
            "# but it is done by MBS, so here we only need to configure this\n" \
            "ccache_hashdir = false\n" \
            "\n" \
            "# Normally, ccache identifies the compiler by name/path/creation time, but repo_setup recreates the\n" \
            "# sdk directory frequently, so the creation time always change. So we configure ccache to identify the\n" \
            "# compiler by its name and the hash of its contents, and then we can have more cache hits.\n" \
            "ccache_compilercheck = content\n" \
            "\n" \
            >> $HOME/.ccache/ccache.conf

    addToEnv() {
        local profile="$1"
        local export_line="export CCACHE_DIR=$HOME/.ccache"

        if ! grep -q -F "$export_line" "$profile"; then
            echo -e "\n$export_line" >>"$profile"
            source "$profile"
        fi
    }

    addToEnv "$HOME/.bashrc"
    addToEnv "$HOME/.zshrc"

    echo "Configuração do ccache foi criada com sucesso!"
}

# ------------------------------------------------------------------------------------------------------------------
installOtherTools(){
    # Other tools
    sudo apt update
    
    sudo apt install -y \
                htop              iotop \
                screenfetch \
                baobab            gparted           gnome-system-monitor \
                valgrind          valgrind-dbg      valgrind-mpi \
                zsh \
                || exit
#                gsfonts \
#                libcanberra-gtk-module \
#                kcachegrind       kcachegrind-converters \


    # Special for Wireshark
    msgBoxEnter "Para instalar Wireshark, por favor selecione <Yes> na instalação a seguir."
    sudo apt install -y   wireshark   || exit

    # Snap installs have automatic updates!
    sudo snap install  code --classic
    sudo snap install  p7zip-desktop
    sudo snap install  postman
    sudo snap install  sublime-merge --classic
    sudo snap install  sublime-text --classic
    sudo snap install  typora
    sudo snap install  sqlitebrowser

    # Configuring SublimeMerge
    smerge "$WORKSPACE_PATH/pos-pax-monitor-lite/"
    sleep 5
    smerge "$WORKSPACE_PATH/pos-newton/"
    sleep 5
    smerge "$WORKSPACE_PATH/pos-mamba/"
    sleep 5
    smerge "$WORKSPACE_PATH/pos-mamba/devtools/"


    # Cleaning:
    sudo apt install -f
    sudo apt autoremove -y
    sudo apt autoclean
}

# ------------------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------------------


executado=1
notExecutado=0
passo1=$notExecutado
passo2=$notExecutado
passo3=$notExecutado
passo4=$notExecutado

opcao="nenhuma"

# Loop principal do menu
while true; do
    echo -e ${green}
    echo
    echo "Sua última opção foi: $opcao"
    echo 
    echo "╔═════════════════════════════════════════════════╗"
    echo "║  ───────  CRIADOR DE AMBIENTE MAMBA  ─────────  ║"
    echo "╠═════════════════════════════════════════════════╣"
    echo "║ Selecione uma opção:                            ║"
    echo "║ a - Instalar - pacotes essenciais Linux         ║"
    echo "║ b - Configurar - GitHub                         ║"
    echo "║ c - Repositórios - Clonar e buildar             ║"
    echo "║ d - Mamba Desktop - instalar, buildar e rodar   ║"
    echo "║ e - Driver PAX - Instalar                       ║"
    echo "║ f - adb Gertec - Configurar                     ║"
    echo "║ g - Docker Mamba - Instalar e buildar           ║"
    echo "║ h - Qt Creator - Instalar e configurar          ║"
    echo "║ i - Configurar ccache (otimizador de builds)    ║"
    echo "║ j - Instalar outras ferramentas úteis para dev  ║"
    echo "║ q - Sair                                        ║"
    echo "╚═════════════════════════════════════════════════╝"
    echo -e ${clear}
    echo "> _"

    read opcao

    case $opcao in
        a)  # Instalação de pacotes
            time installBasicPackages
            passo1=$executado
            ;;

        b)  # Configuração GitHub
            if [[ $passo1 == $executado ]] && [[ $passo2 == $notExecutado ]]; then
                time configGithub
                if [ -f ~/.ssh/id_ed25519.pub ]; then
                    passo2=$executado
                fi
            else
                msgBox  "!"   "Para executar esse passo é necessário ter" \
                              "executado o passo a."
            fi
            ;;

        c)  # Clonagem de repositório
            if [[ $passo2 == $executado ]] && [[ $passo3 == $notExecutado ]] || [[ -f "$HOME/.ssh/id_ed25519.pub" ]]; then
                time cloneRepos
                if [ -d "$MAMBA_PATH" ]; then
                    passo3=$executado
                fi
            else
                msgBox  "!"   "Para executar esse passo, é necessário"  \
                              "configurar o GitHub primeiro (opção b)!"
            fi
            ;;

        d)  # Instalar Mamba desktop
            if [[ $passo3 == $executado ]]; then
                time installMambaDesktop
            else
                msgBox  "!"   "Para executar esse passo, é necessário" \
                              "clonar o repositório primeiro (opção c)!"
            fi
            ;;

        e)  # install PAX driver
            time installPaxDriver
            ;;

        f) # config Gertec communication
            # Installing busybox - Connect the MP35p at the Computer USB.
            adb root
            adb shell "su 0 mount -o rw,remount /system && busybox --install /system/bin"
            ;;

        g)  # DOCKER INSTALL
            msgBox  "!"   "Para executar esse passo é necessário ter" \
                          "executado o passo a) e ter reinicado o sistema."
            time installDockerImage
            ;;

        h)  # Download Qt Creator
            time installQtCreator
            ;;

        i)  # Config ccache
            time config_ccache
            ;;

        j)  # Other tools
            time installOtherTools
            ;;

        k)
            echo "Saindo..."
            exit 0
            ;;

        *)
            echo "Opção inválida, tente novamente."
            ;;
    esac
done
